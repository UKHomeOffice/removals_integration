var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');

describe('Irc_EntryController', function () {
  var controller;
  before(function () {
    controller = sails.controllers.irc_entry;
  });

  describe('Heartbeat', function () {

    describe('Heartbeat_process', function () {
      var schema, custom_fakes, fake_json;
      before(function () {
        schema = require('removals_schema').heartbeat;
        schema.properties.centre.faker = 'custom.centre';
        custom_fakes = {
          centre: 'anotherone'
        };
        fake_json = jhg(schema, custom_fakes);
      });

      it('should be able to process update the centre with heartbeat information', function () {
        return expect(controller.process_heartbeat(fake_json)
          .then(function () {
            return Centre.getByName(fake_json.centre);
          }))
          .to.eventually.contain({
            female_in_use: fake_json.female_occupied,
            female_out_of_commission: fake_json.female_outofcommission,
            male_in_use: fake_json.male_occupied,
            male_out_of_commission: fake_json.male_outofcommission
          });
      });
    });

    it('should validate the request', function () {
      sinon.stub(IrcEntryHeartbeatValidatorService, 'validate').rejects(new ValidationError());
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .then(function () {
          return expect(IrcEntryHeartbeatValidatorService.validate).to.be.calledOnce;
        })
        .tap(function () {
          IrcEntryHeartbeatValidatorService.validate.restore();
        });
    });

    it('should return a 400 if the request is invalid', function () {
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .expect(400);
    });

    it('should return a 200 if all is good', function () {
      sinon.stub(IrcEntryHeartbeatValidatorService, 'validate').resolves(true);
      sinon.stub(controller, 'process_heartbeat').resolves(true);
      return request(sails.hooks.http.app)
        .post('/irc_entry/heartbeat')
        .send()
        .expect(200)
        .toPromise()
        .tap(function () {
          controller.process_heartbeat.restore();
          IrcEntryHeartbeatValidatorService.validate.restore();
        });
    });
  });

  describe('Integration - Routes', function () {
    it('should return the schema for an options request', function () {
      var expected = IrcEntryHeartbeatValidatorService.schema;
      return request(sails.hooks.http.app)
        .options('/irc_entry/heartbeat')
        .expect(200, expected);
    });
  });
});
