"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var controller = require('../../../api/controllers/Irc_EntryController');

describe('INTEGRATION Irc_EntryController', () => {
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
            .then(() => Centre.findOne({name: fake_json.centre})))
            .to.eventually.contain({
              female_in_use: fake_json.female_occupied,
              female_out_of_commission: fake_json.female_outofcommission,
              male_in_use: fake_json.male_occupied,
              male_out_of_commission: fake_json.male_outofcommission
            })
      );
    });

    it('should validate the request', () => {
      sinon.stub(IrcEntryHeartbeatValidatorService, 'validate').rejects(new ValidationError());
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .then(() => expect(IrcEntryHeartbeatValidatorService.validate).to.be.calledOnce)
        .tap(() =>IrcEntryHeartbeatValidatorService.validate.restore());
    });

    it('should return a 400 if the request is invalid', () =>
        request(sails.hooks.http.app)
          .post('/irc_entry/heartbeat')
          .send()
          .expect(400)
    );

    it('should return a 200 if all is good', () => {
      sinon.stub(global.sails.services.ircentryheartbeatvalidatorservice, 'validate').resolves(true);
      sinon.stub(global.sails.controllers.irc_entry, 'process_heartbeat').resolves(true);
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .expect(200)
        .then(controller.process_heartbeat.restore)
        .then(IrcEntryHeartbeatValidatorService.validate.restore);
    });
  });

  describe('Policy check', () => {
    it('should return 403 if a poise user tries to post a heartbeat', () =>
        request_auth(sails.hooks.http.app)
          .post('/irc_entry/heartbeat')
          .send()
          .expect(403)
    );
  });

  describe('Integration - Routes', () => {
    it('should return the schema for an options request', () =>
        request(sails.hooks.http.app)
          .options('/irc_entry/heartbeat')
          .expect(200)
          .expect((res) => expect(res.body.data).to.eql(IrcEntryHeartbeatValidatorService.schema))
    );
  });
});

describe('UNIT Irc_EntryController', () => {
  describe('index', () => {
    it('should return res.ok', () =>
        expect(controller.index(null, {ok: 'flo'})).to.eql('flo')
    );
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
    let centre, fake_request, output, original_centre;
    before(() => {
      original_centre = global.Centre;
      centre = {
        id: 123,
        toJSON: () => 'json'
      };
      global.Centre = {
        update: sinon.stub().resolves([centre]),
        publishUpdate: sinon.stub()
      };
      fake_request = {
        centre: 'foobar',
        male_occupied: 112,
        female_occupied: 999,
        male_outofcommission: 123,
        female_outofcommission: 99
      };
      output = controller.process_heartbeat(fake_request);
    });

    after(() => {
      global.Centre = original_centre;
    });

    it('should update the centre', () =>
        expect(global.Centre.update).to.be.calledWith(
          {name: fake_request.centre},
          {
            male_in_use: fake_request.male_occupied,
            female_in_use: fake_request.female_occupied,
            male_out_of_commission: fake_request.male_outofcommission,
            female_out_of_commission: fake_request.female_outofcommission
          }
        )
    );

    it('should broadcast an event', () =>
        expect(global.Centre.publishUpdate).to.be.calledWith(centre.id, 'json')
    );

    it('should return the amended centre', () =>
        expect(output).eventually.to.eql([centre])
    );
  });
})
;
