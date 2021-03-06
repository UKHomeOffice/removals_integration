/* global controller Heartbeat */
'use strict';

const jhg = require('../../helpers/JsonHelperGenerator');
const ValidationError = require('../../../api/lib/exceptions/ValidationError');
const rewire = require('rewire');
const controller = rewire('../../../api/controllers/Irc_EntryController');
const BedCountService = require('../../../api/services/BedCountService');

describe('INTEGRATION Irc_EntryController', () => {

  describe('process_event', () => {

    it('should handle INTER_SITE_TRANSFER operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {}
      };
      const stubReturnValue = {};
      const processDetaineeStub = sinon.stub().resolves(processDetaineeStubReturnValue);
      const handleInterSiteTransferStub = sinon.stub().returns(stubReturnValue);
      const originalHandleInterSiteTransfer = controller.handleInterSiteTransfer;

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      controller.handleInterSiteTransfer = handleInterSiteTransferStub;

      const request_body = {
        operation: Event.OPERATION_INTER_SITE_TRANSFER
      };

      return controller.process_event(request_body)
        .then((result) => {
          expect(handleInterSiteTransferStub.calledWith(processDetaineeStubReturnValue, request_body)).to.equal(true);
          expect(result).to.be.equal(stubReturnValue);

          controller.handleInterSiteTransfer = originalHandleInterSiteTransfer;
          restores.forEach((restoreMethod) => {
            restoreMethod();
          });
        })
    });

    it('should handle UPDATE operation', () => {
      const detainee = {centre: {id: {}}};
      const processEventDetaineeStub = sinon.stub().resolves(detainee);
      const publishCentreUpdatesStub = sinon.stub(Centres, 'publishUpdateOne').resolves(true);

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processEventDetaineeStub));
      restores.push(publishCentreUpdatesStub.restore);

      const request_body = {
        operation: Event.OPERATION_UPDATE
      };
      const result = controller.process_event(request_body);

      return result.then((result) => {
        expect(processEventDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(publishCentreUpdatesStub.called).to.equal(true);
        expect(result).to.be.equal(detainee);
      }).finally(() => {
        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });

    });

    it('should handle CHECK_IN operation', () => {
      const detainee = {
        centre: {}
      };
      const eventStubReturnValue = {
        centre: {}
      };

      const publishCentreUpdatesStub = sinon.stub(Centres, 'publishUpdateOne').resolves(true);
      const processDetaineeStub = sinon.stub().resolves(detainee);
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);
      const request_body = {
        operation: Event.OPERATION_CHECK_IN,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(controller.__set__('Event.create', EventCreateStub));
      restores.push(publishCentreUpdatesStub.restore);

      const result = controller.process_event(request_body);

      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: detainee.centre,
          detainee: detainee,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(publishCentreUpdatesStub.calledWith(eventStubReturnValue.centre)).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);
      }).finally(() => {

        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

    it('should handle CHECK_OUT operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {
          id: {}
        }
      };
      const processDetaineeStub = sinon.stub().resolves(processDetaineeStubReturnValue);
      const publishCentreUpdatesStub = sinon.stub(Centres, 'publishUpdateOne').resolves(true);
      const eventStubReturnValue = {
        centre: {}
      };
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);

      const request_body = {
        operation: Event.OPERATION_CHECK_OUT,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(publishCentreUpdatesStub.restore);
      restores.push(controller.__set__('Event.create', EventCreateStub));

      const result = controller.process_event(request_body);

      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: processDetaineeStubReturnValue.centre,
          detainee: processDetaineeStubReturnValue,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(publishCentreUpdatesStub.calledWith(eventStubReturnValue.centre)).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);
      }).finally(() => {
        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

    it('should handle REINSTATEMENT operation', () => {
      const processDetaineeStubReturnValue = {
        centre: {
          id: {}
        }
      };
      const detainee = {
        centre: {}
      };
      const eventStubReturnValue = {
        centre: {}
      };
      const processDetaineeStub = sinon.stub().resolves(detainee);
      const EventCreateStub = sinon.stub().resolves(eventStubReturnValue);
      const publishCentreUpdatesStub = sinon.stub(Centres, 'publishUpdateOne').resolves(true);

      const request_body = {
        operation: Event.OPERATION_REINSTATEMENT,
        timestamp: new Date()
      };

      const restores = [];
      restores.push(controller.__set__('processEventDetainee', processDetaineeStub));
      restores.push(controller.__set__('Event.create', EventCreateStub));
      restores.push(publishCentreUpdatesStub.restore);

      const result = controller.process_event(request_body);

      return result.then((result) => {
        expect(processDetaineeStub.calledWith(request_body)).to.equal(true);
        expect(EventCreateStub.calledWith({
          centre: detainee.centre,
          detainee: detainee,
          timestamp: request_body.timestamp,
          operation: request_body.operation
        })).to.equal(true);
        expect(publishCentreUpdatesStub.calledWith(eventStubReturnValue.centre)).to.equal(true);
        expect(result).to.be.equal(eventStubReturnValue);
      }).finally(() => {
        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });

    describe('should handle OOC operations', () => {
      let request_body, context;

      beforeEach(() => {
        context = {processBedEvent: sinon.stub(controller, 'processBedEvent').resolves({centre_id: 1})};
        sinon.stub(Centres, 'publishUpdateOne').resolves();
      });

      afterEach(() => {
        Centres.publishUpdateOne.restore();
        context.processBedEvent.restore();
      });

      it('Should process an out commission bed event', () => {
        request_body = {
          centre: 'example',
          operation: 'out commission'
        };
        controller.process_event.apply(context, [request_body])
          .then(() => {
            expect(context.processBedEvent).to.be.calledWith(request_body);
            expect(Centres.publishUpdateOne).to.be.calledWith(1);
          });
      });

      it('Should process an out commission bed event', () => {
        request_body = {
          centre: 'example',
          operation: 'in commission'
        };
        controller.process_event.apply(context, [request_body])
          .then(() => {
            expect(context.processBedEvent).to.be.calledWith(request_body);
            expect(Centres.publishUpdateOne).to.be.calledWith(1);
          });
      });
    });
  });

  describe('generateDetainee', () => {
    it('should return a object with the correct properties', () => {
      const centre = {};
      const properties = {
        person_id: {},
        timestamp: {},
        nationality: {},
        gender: 'male',
        cid_id: {}
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.centre).to.equal(centre);
      expect(result.person_id).to.equal(properties.person_id);
      expect(result.timestamp).to.equal(properties.timestamp);
      expect(result.nationality).to.equal(properties.nationality);
      expect(result.gender).to.equal('male');
      expect(result.cid_id).to.equal(properties.cid_id);
    });
    it('should normalise gender f to female', () => {
      const centre = {};
      const properties = {
        gender: 'f'
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.gender).to.equal('female');
    });
    it('should normalise gender m to male', () => {
      const centre = {};
      const properties = {
        gender: 'm'
      };
      const result = controller.__get__('generateDetainee')(centre, properties);
      expect(result.gender).to.equal('male');
    });
  });
  describe('generateStandardEvent', () => {
    it('should return an object with the correct properties', () => {
      const detainee = {
        centre: {}
      };
      const properties = {
        operation: {},
        timestamp: {}
      };
      const result = controller.__get__('generateStandardEvent')(detainee, properties);
      expect(result.detainee).to.equal(detainee);
      expect(result.centre).to.equal(detainee.centre);
      expect(result.operation).to.equal(properties.operation);
      expect(result.timestamp).to.equal(properties.timestamp);
    });
  });
  describe('processEventDetainee', () => {
    it('should call createOrUpdateDatainee', () => {
      const centre = {};
      const request_body = {
        centre: {},
        person_id: {},
        timestamp: {},
        nationality: {},
        gender: 'male',
        cid_id: {}
      };
      const detainee = {};
      const createReturnValue = {};

      const findOneStub = sinon.stub().resolves(centre);
      const generateDetaineeStub = sinon.stub().returns(detainee);
      const createOrUpdateDetaineeStub = sinon.stub().resolves(createReturnValue);

      const restores = [];
      restores.push(controller.__set__('Centres.findOne', findOneStub));
      restores.push(controller.__set__('createOrUpdateDetainee', createOrUpdateDetaineeStub));
      restores.push(controller.__set__('generateDetainee', generateDetaineeStub));

      controller.__get__('processEventDetainee')(request_body)
        .then((result) => {
          expect(findOneStub.calledWith({name: request_body.centre})).to.equal(true);
          expect(generateDetaineeStub.calledWith(centre, request_body)).to.equal(true);
          expect(result).to.deep.equal(createReturnValue);
        }).finally(() => {
        restores.forEach((restoreMethod) => {
          restoreMethod();
        });
      });
    });
  });
  describe('handleInterSiteTransfer', () => {
    it('should split an event into a CHECK_IN and CHECK_OUT', () => {
      const request_body = {
        centre: {},
        person_id: {},
        timestamp: {}
      };
      const detainee = {
        nationality: {},
        gender: {},
        cid_id: {}
      };
      const process_eventReturnValue = {};

      const expectedCheckOut = {
        centre: request_body.centre,
        person_id: request_body.person_id,
        operation: Event.OPERATION_CHECK_OUT,
        timestamp: request_body.timestamp
      };

      const expectedCheckIn = {
        centre: request_body.centre_to,
        person_id: request_body.person_id,
        nationality: detainee.nationality,
        gender: detainee.gender,
        cid_id: detainee.cid_id,
        operation: Event.OPERATION_CHECK_IN,
        timestamp: request_body.timestamp
      };

      const process_eventStub = sinon.stub().resolves(process_eventReturnValue);

      const orig_process_event = controller.process_event;
      controller.process_event = process_eventStub;

      controller.handleInterSiteTransfer(detainee, request_body)
        .then((result) => {
          expect(process_eventStub.calledWith(expectedCheckIn)).to.equal(true);
          expect(process_eventStub.calledWith(expectedCheckOut)).to.equal(true);
          expect(result).to.deep.equal(process_eventReturnValue);

          controller.process_event = orig_process_event;
        });
    });
  });
  describe('updateDetaineeModel', () => {
    it('should set the appropriate properties on the model', () => {
      const detainee = {};
      const newProperties = {
        timestamp: {},
        gender: {},
        nationality: {},
        cid_id: {}
      };

      controller.__get__('updateDetaineeModel')(detainee, newProperties);

      expect(detainee.timestamp).to.equal(newProperties.timestamp);
      expect(detainee.gender).to.equal(newProperties.gender);
      expect(detainee.nationality).to.equal(newProperties.nationality);
      expect(detainee.cid_id).to.equal(newProperties.cid_id);
    });

    it('should only set gender, nationality and cid_id if truthy', () => {
      const detainee = {
        timestamp: {},
        gender: {},
        nationality: {},
        cid_id: {}
      };
      const newProperties = {
        timestamp: {},
        gender: '',
        nationality: '',
        cid_id: ''
      };

      controller.__get__('updateDetaineeModel')(detainee, newProperties);

      expect(detainee.timestamp).to.equal(newProperties.timestamp);
      expect(detainee.gender).to.not.equal(newProperties.gender);
      expect(detainee.nationality).to.not.equal(newProperties.nationality);
      expect(detainee.cid_id).to.not.equal(newProperties.cid_id);
    });
  });

  describe('createOrUpdateDetainee ', () => {
    describe('when no matching detainee', () => {
      const restores = [];
      const createReturnValue = {};
      const findOneStub = sinon.stub().resolves(undefined);
      const createStub = sinon.stub().resolves(createReturnValue);
      const getPopulatedDetaineeStub = sinon.stub().resolves(createReturnValue);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
        restores.push(controller.__set__('Detainee.create', createStub));
        restores.push(controller.__set__('getPopulatedDetainee', getPopulatedDetaineeStub));
      });
      it('should create a new detainee', () => {
        const detaineeProperties = {
          centre: {id: {}},
          person_id: {},
          somethingElse: {}
        };
        const result = controller.__get__('createOrUpdateDetainee')(detaineeProperties);

        expect(findOneStub).to.have.been.calledWith({
          centre: detaineeProperties.centre.id,
          person_id: detaineeProperties.person_id
        });

        return expect(result).to.eventually.equal(createReturnValue);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });

    describe('when new timestamp is later than old timestamp', () => {
      const restores = [];
      const saveReturnValue = {};
      const dummyDetaineeRecord = {
        timestamp: new Date('2016-05-01'),
        save: sinon.stub().resolves(saveReturnValue)
      };
      const findOneStub = sinon.stub().resolves(dummyDetaineeRecord);
      const getPopulatedDetaineeStub = sinon.stub().resolves(saveReturnValue);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
        restores.push(controller.__set__('getPopulatedDetainee', getPopulatedDetaineeStub));
      });
      it('should update the detainee', () => {
        const detaineeProperties = {
          centre: {id: {}},
          timestamp: (new Date('2016-05-02')).toISOString()
        };
        return expect(controller.__get__('createOrUpdateDetainee')(detaineeProperties)).to.eventually.equal(saveReturnValue);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });

    describe('when new timestamp is earlier than old timestamp', () => {
      const restores = [];
      const dummyDetaineeRecord = {
        timestamp: new Date('2016-05-02')
      };
      const findOneStub = sinon.stub().resolves(dummyDetaineeRecord);
      beforeEach(() => {
        restores.push(controller.__set__('Detainee.findOne', findOneStub));
      });
      it('should return the found detainee', () => {
        const detaineeProperties = {
          centre: {id: {}},
          timestamp: (new Date('2016-05-01')).toISOString()
        };
        return expect(controller.__get__('createOrUpdateDetainee')(detaineeProperties)).to.eventually.equal(dummyDetaineeRecord);
      });
      afterEach(() => {
        restores.forEach((restore) => {
          restore();
        });
      });
    });
  });

  describe('Heartbeat', () => {
    describe('Heartbeat_process', () => {
      let schema, custom_fakes, fake_json;
      before(() => {
        schema = require('removals_schema').heartbeat;
        schema.properties.centre.faker = 'custom.centre';
        custom_fakes = {
          centre: 'anotherone'
        };
        fake_json = jhg(schema, custom_fakes);
      });

      it('should be able to process update the centre with heartbeat information', () =>
        expect(controller.process_heartbeat(fake_json)
          .then(() => Centres.findOne({name: fake_json.centre})))
          .to.eventually.contain({
          female_in_use: fake_json.female_occupied,
          female_out_of_commission: fake_json.female_outofcommission,
          male_in_use: fake_json.male_occupied,
          male_out_of_commission: fake_json.male_outofcommission
        })
      );
      describe('with heartbeat timestamp', () => {
        it('should update the centre heartbeat timestamp on processing an update', () =>
          expect(controller.process_heartbeat(fake_json)
            .then(() =>
              Centres.findOne({name: fake_json.centre})
            ))
            .to.eventually.have.property('heartbeat_received')
            .and.be.a('date')
        );
      })
    });
    describe('isolated verbose log level', () => {
      beforeEach(() => {
        sinon.stub(global.sails.log, 'verbose');
      });
      afterEach(() =>
        global.sails.log.verbose.restore()
      );
      it('should validate the request', () => {
        sinon.stub(IrcEntryHeartbeatValidatorService, 'validate').rejects(new ValidationError());
        return request(sails.hooks.http.app)
          .post('/irc_entry/heartbeat')
          .send()
          .then(() => expect(IrcEntryHeartbeatValidatorService.validate).to.be.calledOnce)
          .finally(IrcEntryHeartbeatValidatorService.validate.restore);
      });

      it('should return a 400 if the request is invalid', () =>
        request(sails.hooks.http.app)
          .post('/irc_entry/heartbeat')
          .send()
          .expect(400)
      );
    });

    it('should return a 201 if all is good', () => {
      sinon.stub(global.sails.services.ircentryheartbeatvalidatorservice, 'validate').resolves(true);
      sinon.stub(global.sails.controllers.irc_entry, 'process_heartbeat').resolves(true);
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send({})
        .expect(201)
        .then(() => global.sails.controllers.irc_entry.process_heartbeat.restore())
        .finally(() => IrcEntryHeartbeatValidatorService.validate.restore());
    });
  });

  describe('Integration - Routes', () => {
    it('should return the schema for an options request heartbeat', () =>
      request(sails.hooks.http.app)
        .options('/irc_entry/heartbeat')
        .expect(200)
        .expect((res) => expect(res.body.data).to.eql(IrcEntryHeartbeatValidatorService.schema))
    );
    it('should return the schema for an options request event', () =>
      request(sails.hooks.http.app)
        .options('/irc_entry/event')
        .expect(200)
        .expect((res) => expect(res.body.data).to.eql(IrcEntryEventValidatorService.schema))
    );
  });
});

describe('UNIT Irc_EntryController', () => {
  describe('index', () => {
    it('should return res.ok', () =>
      expect(controller.index(null, {ok: 'flo'})).to.eql('flo')
    );
  });

  describe('processBedEvent', () => {
    let event, context;

    beforeEach(() => {
      event = {
        operation: 'out commission',
        timestamp: "2016-11-23T18:25:42.511Z",
        centre: 'bigone',
        bed_ref: '123',
        reason: 'Other',
        gender: 'm'
      };

      context = {
        findAndPopulateCentre: sinon.spy(controller, 'findAndPopulateCentre'),
        findAndPopulateDetaineeInBedEvent: sinon.spy(controller, 'findAndPopulateDetaineeInBedEvent'),
        formatAndPopulateGender: sinon.spy(controller, 'formatAndPopulateGender'),
        findOrCreateAndPopulateBed: sinon.spy(controller, 'findOrCreateAndPopulateBed'),
        findAndPopulateActiveStatus: sinon.spy(controller, 'findAndPopulateActiveStatus'),
        reconcilePreviousBedEvents: sinon.spy(controller, 'reconcilePreviousBedEvents')
      };

      sinon.stub(BedEvent, 'create').resolves({something: true})
    });

    afterEach(() => {
      context.findAndPopulateCentre.restore();
      context.findAndPopulateDetaineeInBedEvent.restore();
      context.formatAndPopulateGender.restore();
      context.findOrCreateAndPopulateBed.restore();
      context.findAndPopulateActiveStatus.restore();
      context.reconcilePreviousBedEvents.restore();
      BedEvent.create.restore();
    });

    it('Should process a bed event', () =>
      controller.processBedEvent.apply(context, [event])
        .then(() => {
          expect(context.findAndPopulateDetaineeInBedEvent).to.have.been.calledOnce;
          expect(context.formatAndPopulateGender).to.have.been.calledOnce;
          expect(context.findAndPopulateDetaineeInBedEvent).to.have.been.calledOnce;
          expect(context.findOrCreateAndPopulateBed).to.have.been.calledOnce;
          expect(context.findAndPopulateActiveStatus).to.have.been.calledOnce;
          expect(context.reconcilePreviousBedEvents).to.have.been.calledOnce;
          expect(BedEvent.create).to.have.been.calledOnce;
        })
    );
  });

  describe('findAndPopulateCentre', () => {
    var input = {
      centre: 'example',
      operation: 'out commission'
    };

    var output = {
      centre: 'example',
      operation: 'out commission',
      centre_id: 1
    };

    before(() => sinon.stub(Centres, 'getByName').resolves({id: 1}));

    after(() => Centres.getByName.restore());

    it('should merge the result into the response', () =>
      expect(controller.findAndPopulateCentre(input)).to.eventually.eql(output)
    );
  });

  describe('findAndPopulateDetaineeInBedEvent', () => {
    let createOrUpdateDetainee;
    before(() => {
      createOrUpdateDetainee = controller.__set__('createOrUpdateDetainee', sinon.stub().resolves({id: 2}))
    });
    after(() => {
      createOrUpdateDetainee();
    });

    it('should merge the response into the result when person_id is available', ()=> {
      expect(controller.findAndPopulateDetaineeInBedEvent({
        single_occupancy_person_id: '123',
        centre_id: 1
      })).to.eventually.deep.equal({
        single_occupancy_person_id: '123',
        centre_id: 1,
        detainee: 2
      })
    });

    it('should merge the response into {detainee: null} when person_id is null', ()=> {
      expect(controller.findAndPopulateDetaineeInBedEvent({
        single_occupancy_person_id: null,
        centre_id: 1
      })).to.eventually.deep.equal({
        single_occupancy_person_id: null,
        centre_id: 1,
        detainee: null
      })
    });

    it('should merge the response into {detainee: null} when person_id is undefined', ()=> {
      expect(controller.findAndPopulateDetaineeInBedEvent({
        single_occupancy_person_id: undefined,
        centre_id: 1
      })).to.eventually.deep.equal({
        single_occupancy_person_id: undefined,
        centre_id: 1,
        detainee: null
      })
    });
  });

  describe('formatAndPopulateGender', () => {
    var dummyEvent = {
      gender: 'f',
      example: 'example'
    };

    before(() => sinon.stub(Bed, 'normalizeGender').returns('female'));

    after(() => Bed.normalizeGender.restore());

    it('should pass the correct mapping to Bed.normalizeGender', () => {
        controller.formatAndPopulateGender(dummyEvent);
        return expect(Bed.normalizeGender).to.be.calledWith('f');
      }
    );

    it('should merge the result into the response', () =>
      expect(controller.formatAndPopulateGender(dummyEvent)).to.deep.equal({
        gender: 'female',
        example: 'example'
      })
    );
  });

  describe('findOrCreateAndPopulateBed', () => {
    var dummyEvent = {
      centre_id: 1,
      bed_ref: '123',
      gender: 'female'
    };

    before(() => sinon.stub(Bed, 'findAndUpdateOrCreate').resolves({id: 12}));

    after(() => Bed.findAndUpdateOrCreate.restore());

    it('should pass the correct mapping to Bed.findOrCreate', () => {
      controller.findOrCreateAndPopulateBed(dummyEvent);
      return expect(Bed.findAndUpdateOrCreate).to.be.calledWith(
        {bed_ref: '123', centre: 1},
        {
          centre: 1,
          bed_ref: '123',
          gender: 'female'
        });
    });

    it('should not pass the gender if it does not have it', () => {
      controller.findOrCreateAndPopulateBed({
        centre_id: 1,
        bed_ref: '123',
        gender: null
      });
      return expect(Bed.findAndUpdateOrCreate).to.be.calledWith(
        {bed_ref: '123', centre: 1},
        {
          centre: 1,
          bed_ref: '123',
        });
    });

    it('should merge the result into the response', () =>
      expect(controller.findOrCreateAndPopulateBed(dummyEvent)).to.eventually.eql({
        bed: 12,
        bed_ref: "123",
        centre_id: 1,
        gender: "female"
      })
    );
  });

  describe('findAndPopulateActiveStatus', () => {
    var event = {
      bed: 1,
      timestamp: 'example'
    };

    afterEach(() => BedEvent.findOne.restore());

    it('should pass the correct mapping to BedEvent.findOne', () => {
        sinon.stub(BedEvent, 'findOne').resolves({something: true})
        controller.findAndPopulateActiveStatus(event);
        return expect(BedEvent.findOne).to.be.calledWith({
          bed: 1, timestamp: {'>=': 'example'}
        })
      }
    );

    it('when current event is the most recent: should merge {active: true} into the response', () => {
      sinon.stub(BedEvent, 'findOne').resolves(undefined)

      return expect(controller.findAndPopulateActiveStatus(event)).to.eventually.eql({
        bed: 1,
        timestamp: 'example',
        active: true
      });
    });

    it('when current event is not the most recent: should merge {active: false} into the response', () => {
      sinon.stub(BedEvent, 'findOne').resolves('something');

      return expect(controller.findAndPopulateActiveStatus(event)).to.eventually.eql({
        bed: 1,
        timestamp: 'example',
        active: false
      });
    });

  });

  describe('reconcilePreviousBedEvents', () => {
    beforeEach(() => sinon.stub(BedEvent, 'deactivatePastBedEvents').resolves());

    afterEach(() => BedEvent.deactivatePastBedEvents.restore());

    it('should not deactivate past bed events when current event is not active', () => {
      controller.reconcilePreviousBedEvents({
        bed: 1,
        timestamp: 'this',
        active: false
      });
      return expect(BedEvent.deactivatePastBedEvents).to.not.be.called;
    });

    it('should deactivate past bed events when current event is active', () => {
      controller.reconcilePreviousBedEvents({
        bed: 1,
        timestamp: 'now',
        active: true
      });
      expect(BedEvent.deactivatePastBedEvents).to.be.calledWith(1, 'now');
    });
  });

  describe('heartbeatPost', () => {
    let res, req, context, validationservice;
    beforeEach(() => {
      validationservice = global.IrcEntryHeartbeatValidatorService;
      global.IrcEntryHeartbeatValidatorService = {
        validate: sinon.stub().resolves()
      };
      req = {
        body: 'foo'
      };
      res = {
        badRequest: sinon.stub(),
        serverError: sinon.stub(),
        ok: sinon.stub()
      };
      context = {
        process_heartbeat: sinon.stub.resolves()
      };
    });
    afterEach(() => global.IrcEntryHeartbeatValidatorService = validationservice);

    it('Should validate the req.body', () =>
      controller.heartbeatPost.apply(context, [req, res])
        .then(() =>expect(global.IrcEntryHeartbeatValidatorService.validate).to.be.calledWith(req.body))
    )

    it('Should return res.ok', () =>
      controller.heartbeatPost.apply(context, [req, res])
        .then(() => expect(res.ok).to.be.calledOnce)
    );

    it('Should return res.badRequest on validationError', () => {
      global.IrcEntryHeartbeatValidatorService.validate = sinon.stub().rejects(new ValidationError('f'));
      return controller.heartbeatPost.apply(context, [req, res]).finally(() =>
        expect(res.badRequest).to.be.calledOnce
      );
    });

    it('Should return res.serverError on validationError', () => {
      global.IrcEntryHeartbeatValidatorService.validate = sinon.stub().rejects('error');
      return controller.heartbeatPost.apply(context, [req, res]).finally(() =>
        expect(res.serverError).to.be.calledOnce
      );
    });

    it('Should not return res.ok on error', () => {
      global.IrcEntryHeartbeatValidatorService.validate = sinon.stub().rejects('error');
      return controller.heartbeatPost.apply(context, [req, res]).finally(() =>
        expect(res.ok).to.not.be.called
      );
    });
  });

  describe('heartbeatOptions', () => {
    let validationservice;
    before(() => {
      validationservice = global.IrcEntryHeartbeatValidatorService;
      global.IrcEntryHeartbeatValidatorService = {
        schema: 'foobar'
      };
    });
    after(() => global.IrcEntryHeartbeatValidatorService = validationservice);

    it('should return the schema', () => {
      let res = {ok: sinon.stub()}
      controller.heartbeatOptions(null, res);
      expect(res.ok).to.be.calledWith('foobar');
    });
  });

  describe('process_heartbeat', () => {
    let centre, fake_request, output, clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
      centre = {
        id: 123,
        toJSON: () => 'json',
        male_occupied: 112,
        female_occupied: 999,
        male_outofcommission: 123,
        female_outofcommission: 99
      };
      sinon.stub(Centres, 'update').resolves([centre]);
      sinon.stub(Heartbeat, 'create').resolves(true);
      fake_request = {
        centre: 'foobar',
        male_occupied: 112,
        female_occupied: 999,
        male_outofcommission: 123,
        female_outofcommission: 99
      };
      output = controller.process_heartbeat(fake_request);
    });

    afterEach(() => {
      clock.restore();
      Centres.update.restore();
      Heartbeat.create.restore();
    });

    it('should update the centre', () =>
      expect(global.Centres.update).to.be.calledWith(
        {name: fake_request.centre},
        {
          heartbeat_received: new Date(),
          male_in_use: fake_request.male_occupied,
          female_in_use: fake_request.female_occupied,
          male_out_of_commission: fake_request.male_outofcommission,
          female_out_of_commission: fake_request.female_outofcommission
        }
      )
    );

    it('should create a heartbeat', () =>
      output.tap(() => expect(global.Heartbeat.create).to.be.calledWith({
        centre: 123,
        male_in_use: fake_request.male_occupied,
        female_in_use: fake_request.female_occupied,
        male_out_of_commission: fake_request.male_outofcommission,
        female_out_of_commission: fake_request.female_outofcommission
      }))
    );

    it('should return the amended centre', () =>
      expect(output).eventually.to.eql(centre)
    );
  });
})
