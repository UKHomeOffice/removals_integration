var jhg = require('../../helpers/JsonHelperGenerator');

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
          centre: 'harmondsworth'
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
    it('should validate the request');
    it('should return a 403 if the request is invalid');
    it('should validate the centre name against the centres in the database');
    it('should return a 200 if all is good');
  });
  describe('Integration - Routes', function () {
    it('should present the correct route to the heartbeat method');
    it('should present the links available from the index');
    it('should return the schema for an options request', function () {
      var expected = require('removals_schema').heartbeat;
      return request(sails.hooks.http.app)
        .options('/irc_entry/heartbeat')
        .expect(200, expected);
    });
  });

});
