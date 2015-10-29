var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');

describe('Irc_EntryController', () => {
  var controller;
  before(() => controller = sails.controllers.irc_entry);

  describe('Heartbeat', () => {
    describe('Heartbeat_process', () => {
      var schema, custom_fakes, fake_json;
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
            .then(() => Centre.getByName(fake_json.centre)))
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
      sinon.stub(IrcEntryHeartbeatValidatorService, 'validate').resolves(true);
      sinon.stub(controller, 'process_heartbeat').resolves(true);
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .expect(200)
        .then(controller.process_heartbeat.restore)
        .then(IrcEntryHeartbeatValidatorService.validate.restore);
    });
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
