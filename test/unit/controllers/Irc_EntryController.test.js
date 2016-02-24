"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var controller = require('../../../api/controllers/Irc_EntryController');

describe('INTEGRATION Irc_EntryController', () => {
  describe('Heartbeat', () => {
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
    describe('options', () => {
      it('should return the heartbeat schema for an options request', () =>
        request(sails.hooks.http.app)
          .options('/irc_entry/heartbeat')
          .expect(200)
          .expect((res) => expect(res.body.data).to.eql(IrcEntryHeartbeatValidatorService.schema))
      );
    })
    describe('post', () => {
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
  });

  describe('Event', () => {
    describe('isolated verbose log level', () => {
      beforeEach(() => {
        sinon.stub(global.sails.log, 'verbose');
      });
      afterEach(() =>
          global.sails.log.verbose.restore()
      );
      it('should validate the request', () => {
        sinon.stub(IrcEntryEventValidatorService, 'validate').rejects(new ValidationError());
        return request(sails.hooks.http.app)
          .post('/irc_entry/event')
          .send()
          .then(() => expect(IrcEntryEventValidatorService.validate).to.be.calledOnce)
          .finally(IrcEntryEventValidatorService.validate.restore);
      });

      it('should return a 400 if the request is invalid', () =>
          request(sails.hooks.http.app)
            .post('/irc_entry/event')
            .send()
            .expect(400)
      );
    });
    describe('options', () => {
      it('should return the event schema for an options request', () =>
        request(sails.hooks.http.app)
          .options('/irc_entry/event')
          .expect(200)
          .expect((res) => expect(res.body.data).to.eql(IrcEntryEventValidatorService.schema))
      );
    })
    describe('post', () => {
      var fake_request_body;
      before(() => {
        fake_request_body = {
          timestamp: new Date(),
          centre: 'bigone',
          operation: 'check in',
          person_id: 1243,
          cid_id: 4567,
          gender: 'male',
          nationality: 'fr'
        };
      });
      beforeEach(() => {
        sinon.stub(IrcEntryEventValidatorService, 'validate').resolves(fake_request_body)
        sinon.stub(Detainees, 'findOrCreate').resolves(true);
        sinon.stub(Events, 'findOrCreate').resolves(true);
      });
      afterEach(() => {
        IrcEntryEventValidatorService.validate.restore();
        Detainees.findOrCreate.restore();
        Events.findOrCreate.restore();
      });

      it('should return a 201 if all is good', () => {
        return request(sails.hooks.http.app)
          .post('/irc_entry/event')
          .send(fake_request_body)
          .then((res) => expect(res.statusCode).to.equal(201));
      });

      it('should create or update an event and a detainees by person_id', () => {
        var person_id = fake_request_body.cid_id + '_' + fake_request_body.person_id;
        return request(sails.hooks.http.app)
          .post('/irc_entry/event')
          .send(fake_request_body)
          .expect(201)
          .then(() => expect(Events.findOrCreate).to.have.been.calledWith({
            person_id: person_id
          }, {
            operation: fake_request_body.operation,
            event_received: fake_request_body.timestamp,
            person_id: person_id
          }))
          .then(() => expect(Detainees.findOrCreate).to.have.been.calledWith({
            person_id: person_id
          }, {
            person_id: person_id,
            cid_id: fake_request_body.cid_id,
            gender: fake_request_body.gender,
            nationality: fake_request_body.nationality,
            centre: fake_request_body.centre
          }));
      });
    });
  });
});

describe('UNIT Irc_EntryController', () => {
  describe('index', () => {
    it('should return res.ok', () =>
      expect(controller.index(null, {ok: 'flo'})).to.eql('flo')
    );
  });

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
          .to.eventually.have.property('heartbeat_recieved')
          .and.be.a('date')
      );
    })
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

  describe('eventOptions', () => {
    let validationservice;
    before(() => {
      validationservice = global.IrcEntryEventValidatorService;
      global.IrcEntryEventValidatorService = {
        schema: 'foobar'
      };
    });
    after(() => global.IrcEntryEventValidatorService = validationservice);

    it('should return the schema', () => {
      let res = {ok: sinon.stub()}
      controller.eventOptions(null, res);
      expect(res.ok).to.be.calledWith('foobar');
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
    let centre, fake_request, output, original_centre, clock;
    beforeEach(() => {
      clock = sinon.useFakeTimers();
      original_centre = global.Centres;
      centre = {
        id: 123,
        toJSON: () => 'json'
      };
      sinon.stub(Centres, 'update').resolves([centre]);
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
      global.Centres = original_centre;
      Centres.update.restore();
    });

    it('should update the centre', () =>
      expect(global.Centres.update).to.be.calledWith(
        {name: fake_request.centre},
        {
          heartbeat_recieved: new Date(),
          male_in_use: fake_request.male_occupied,
          female_in_use: fake_request.female_occupied,
          male_out_of_commission: fake_request.male_outofcommission,
          female_out_of_commission: fake_request.female_outofcommission
        }
      )
    );

    it('should return the amended centre', () =>
      expect(output).eventually.to.eql([centre])
    );
  });

  describe('process_event', () => {
    beforeEach(() =>
        sinon.stub(controller, 'processEventDetaineesCreateOrUpdate')
    );
    afterEach(() =>
        controller.processEventDetaineesCreateOrUpdate.restore()
    );

    it('should run processEventDetaineesCreateOrUpdate on checkin operation', () => {
      controller.process_event({operation: 'check in'});
      return expect(controller.processEventDetaineesCreateOrUpdate).to.be.calledOnce;
    });

    it('should run processEventDetaineesCreateOrUpdate on update operation', () => {
      controller.process_event({operation: 'update individual'});
      return expect(controller.processEventDetaineesCreateOrUpdate).to.be.calledOnce;
    });

    it('should reject an unknown operation', () =>
        expect(() => controller.process_event({operation: 'foo'})).to.throw(ValidationError)
    );
  });

  describe('processEventDetaineesCreateOrUpdate', () => {
    var fake_request_body;

    before(() => {
      fake_request_body = {
        timestamp: new Date(),
        centre: 'bigone',
        operation: 'check in',
        person_id: 1243,
        cid_id: 4567,
        gender: 'male',
        nationality: 'ONE'
      };
      sinon.stub(Events, 'findOrCreate').resolves(true);
      sinon.stub(Detainees, 'findOrCreate').resolves(true);
    });

    after(() => {
      Detainees.findOrCreate.restore();
      Events.findOrCreate.restore();
    });

    it('check in should be captured', () =>
      expect(controller.processEventDetaineesCreateOrUpdate(fake_request_body)).to.be.eventually.ok
    );
    it('should map the fields correctly to the Events model', () => {
      controller.processEventDetaineesCreateOrUpdate(fake_request_body);
      expect(Events.findOrCreate).to.be.calledWith(
        {
          person_id: fake_request_body.cid_id + '_' + fake_request_body.person_id
        }, {
          operation: fake_request_body.operation,
          event_received: sinon.match.instanceOf(Date),
          person_id: fake_request_body.cid_id + '_' + fake_request_body.person_id,
        }
      );
    });
    it('should map the fields correctly to the Detainees model', () => {
      controller.processEventDetaineesCreateOrUpdate(fake_request_body);
      expect(Detainees.findOrCreate).to.be.calledWith(
        {
          person_id: fake_request_body.cid_id + '_' + fake_request_body.person_id
        }, {
          cid_id: fake_request_body.cid_id,
          gender: fake_request_body.gender,
          nationality: fake_request_body.nationality,
          person_id: fake_request_body.cid_id + '_' + fake_request_body.person_id,
          centre: fake_request_body.centre
        }
      );
    });
  });
});
