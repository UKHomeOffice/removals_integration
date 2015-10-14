var jhg = require('../../helpers/JsonHelperGenerator');

describe('Irc_EntryController', function () {
  var controller;
  before(function () {
    controller = sails.controllers.irc_entry;
  });

  describe('Heartbeat', function () {
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
});
