/* global IrcEntryEventValidatorService Event Detainee Heartbeat  BedEvent Bed*/
'use strict';

const ValidationError = require('../lib/exceptions/ValidationError');
const DuplicationError = require('../lib/exceptions/DuplicationError');
const UnprocessableEntityError = require('../lib/exceptions/UnprocessableEntityError');
const WLError = require('sails/node_modules/waterline/lib/waterline/error/WLError.js');

const updateDetaineeModel = (detainee, newDetaineeProperties) => {
  detainee.timestamp = newDetaineeProperties.timestamp;

  if (newDetaineeProperties.gender) {
    detainee.gender = newDetaineeProperties.gender;
  }
  if (newDetaineeProperties.nationality) {
    detainee.nationality = newDetaineeProperties.nationality;
  }
  if (newDetaineeProperties.cid_id) {
    detainee.cid_id = newDetaineeProperties.cid_id;
  }
};

let generateStandardEvent = (detainee, request_body) =>
  ({
    centre: detainee.centre,
    detainee: detainee,
    operation: request_body.operation,
    timestamp: request_body.timestamp
  });

let generateDetainee = (centre, request_body) =>
  ({
    centre: centre,
    person_id: request_body.person_id,
    timestamp: request_body.timestamp,
    nationality: request_body.nationality,
    gender: Detainee.normalizeGender(request_body.gender),
    cid_id: request_body.cid_id
  });

let getPopulatedDetainee = (detaineeId) => Detainee.findOne(detaineeId).populate('centre');

let createOrUpdateDetainee = (detaineeProperties) =>
  Detainee.findOne({
    person_id: detaineeProperties.person_id,
    centre: detaineeProperties.centre.id
  }).then((detainee) => {
    if (!detainee) {
      return Detainee.create(detaineeProperties)
        .then((detainee) => getPopulatedDetainee(detainee.id));
    } else if (detainee.timestamp.toISOString() <= detaineeProperties.timestamp) {
      updateDetaineeModel(detainee, detaineeProperties);
      return detainee.save()
        .then((detainee) => getPopulatedDetainee(detainee.id));
    }
    return detainee;
  });

let processEventDetainee = (request_body) =>
  Centres.findOne({name: request_body.centre})
    .then((centre) => createOrUpdateDetainee(generateDetainee(centre, request_body)));

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false,
    exposedMethods: [
      'heartbeat',
      'event'
    ]
  },

  heartbeatOptions: (req, res) =>
    res.ok(IrcEntryHeartbeatValidatorService.schema),
  eventOptions: (req, res) =>
    res.ok(IrcEntryEventValidatorService.schema),

  index: (req, res) => res.ok,

  process_heartbeat: (request_body) =>
    Centres.update({
      name: request_body.centre
    }, {
      heartbeat_received: new Date(),
      male_in_use: request_body.male_occupied,
      female_in_use: request_body.female_occupied,
      male_out_of_commission: request_body.male_outofcommission,
      female_out_of_commission: request_body.female_outofcommission
    })
      .then(centres => {
        if (centres.length !== 1) {
          throw new ValidationError("Invalid centre");
        }
        return centres[0];
      })
      .tap(centre => Heartbeat.create({
        centre: centre.id,
        male_in_use: request_body.male_occupied,
        female_in_use: request_body.female_occupied,
        male_out_of_commission: request_body.male_outofcommission,
        female_out_of_commission: request_body.female_outofcommission
      })),

  heartbeatPost: function (req, res) {
    return IrcEntryHeartbeatValidatorService.validate(req.body)
      .then(this.process_heartbeat)
      .tap(() => res.ok())
      .tap((centre) => Centres.publishUpdateOne(centre))
      .catch(ValidationError, (error) => {
        res.badRequest(error.message);
      })
      .catch((error) => {
        res.serverError(error.message);
      });
  },

  process_event: function (request_body) {
    switch (request_body.operation) {
    case Event.OPERATION_INTER_SITE_TRANSFER:
      return processEventDetainee(request_body)
          .then((detainee) => this.handleInterSiteTransfer(detainee, request_body));
    case Event.OPERATION_UPDATE:
      return processEventDetainee(request_body)
          .tap((detainee) => {
            Centres.publishUpdateOne(detainee.centre);
          });
    case Event.OPERATION_CHECK_IN:
    case Event.OPERATION_CHECK_OUT:
    case Event.OPERATION_REINSTATEMENT:
      return processEventDetainee(request_body)
          .then((detainee) => Event.create(generateStandardEvent(detainee, request_body)))
          .tap((event) => {
            Centres.publishUpdateOne(event.centre);
          });
    case BedEvent.OPERATION_OUT_OF_COMMISSION:
    case BedEvent.OPERATION_IN_COMMISSION:
      return this.processBedEvent(request_body)
          .tap((event) => {
            Centres.publishUpdateOne(event.centre_id);
          });
    default:
      throw new ValidationError('Unknown operation');
    }
  },

  findAndPopulateCentre: event =>
    Centres.getByName(event.centre)
      .then((result) => _.assign(event, {centre_id: result.id})),

  findAndPopulateDetaineeInBedEvent: (event) => {
    let eventWithDetainee;
    if (_.isNull(event.single_occupancy_person_id) || _.isUndefined(event.single_occupancy_person_id)) {
      eventWithDetainee = Promise.resolve(_.assign(event, {detainee: null}));
    } else {
      eventWithDetainee = createOrUpdateDetainee({
        person_id: event.single_occupancy_person_id,
        centre: {id: event.centre_id},
        timestamp: event.timestamp
      })
        .then((result) =>
          _.assign(event, {detainee: result.id}));
    }
    return eventWithDetainee;
  },

  formatAndPopulateGender: (event) =>
    _.assign(event, {gender: Bed.normalizeGender(event.gender)}),

  findOrCreateAndPopulateBed: (event) =>
    Bed.findOrCreate({
      bed_ref: event.bed_ref,
      centre: event.centre_id
    }, {
      centre: event.centre_id,
      bed_ref: event.bed_ref,
      gender: event.gender
    })
      .then((bed) => _.assign(event, {bed: bed.id})),

  findAndPopulateActiveStatus: (event) =>
    BedEvent.findOne({bed: event.bed, timestamp: {'>=': event.timestamp}})
      .then((result) =>
        _.assign(event, {active: _.isUndefined(result)})),

  reconcilePreviousBedEvents: (event) =>
  event.active && BedEvent.deactivatePastBedEvents(event.bed, event.timestamp),

  processBedEvent: function (event) {
    return this.findAndPopulateCentre(event)
      .then(this.findAndPopulateDetaineeInBedEvent)
      .then(this.formatAndPopulateGender)
      .then(this.findOrCreateAndPopulateBed)
      .then(this.findAndPopulateActiveStatus)
      .tap(this.reconcilePreviousBedEvents)
      .tap((event) => BedEvent.create(event));
  },

  handleInterSiteTransfer: function (detainee, request_body) {
    if (detainee.gender === null) {
      throw new UnprocessableEntityError('Cannot Inter Site Transfer an unknown Detainee');
    }
    return this.process_event({
      centre: request_body.centre,
      person_id: request_body.person_id,
      timestamp: request_body.timestamp,
      operation: Event.OPERATION_CHECK_OUT
    })
      .then(() => this.process_event({
        centre: request_body.centre_to,
        person_id: request_body.person_id,
        timestamp: request_body.timestamp,
        nationality: detainee.nationality,
        gender: detainee.gender,
        cid_id: detainee.cid_id,
        operation: Event.OPERATION_CHECK_IN
      }));
  },

  eventPost: function (req, res) {
    return IrcEntryEventValidatorService.validate(req.body)
      .then(this.process_event)
      .then(() => res.ok())
      .catch(WLError, error => {
        throw error.originalError;
      })
      .catch(ValidationError, error => res.badRequest(error.result.errors[0].message))
      .catch(UnprocessableEntityError, error =>
        res.status(error.statusCode)
          .send(error.result)
      )
      .catch(DuplicationError, (error) =>
        res.status(error.statusCode)
          .send(error)
      )
      .catch((error) => {
        res.serverError(error.message);
      });
  }
};
