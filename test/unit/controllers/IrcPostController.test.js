var request = require('supertest-as-promised');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-as-promised'));
var json_schema_faker = require('json-schema-faker');


describe('IrcPostController', function () {

  describe('JS Validation', function () {
    describe('all scenarios should pass json schema check', function () {
      var scenarios = [
        {bed_in_of_commission: require('../../scenarios/bed_in_of_commission.json')},
        {bed_out_of_commission: require('../../scenarios/bed_out_of_commission.json')},
        {detainee_checked_in: require('../../scenarios/detainee_checked_in.json')},
        {detainee_checked_out: require('../../scenarios/detainee_checked_out.json')},
        {inter_centre_move: require('../../scenarios/inter_centre_move.json')}
      ];
      return _.map(scenarios, function (scenario) {
        return it(Object.keys(scenario)[0] + ' should pass json schema check', function () {
          return request(sails.hooks.http.app)
            .post('/IrcPost')
            .send(scenario[Object.keys(scenario)[0]])
            .expect(200);
        });
      });
    });

    it('should fail invalid json', function () {
      return request(sails.hooks.http.app)
        .post('/IrcPost')
        .send('4')
        .expect(400);
    });
  });

  describe('Use JSON schema to generate false data', function () {
    var schema = require('../../../api/services/request_schemas/irc.json');
    return _.times(10, function (n) {
      return it('Should pass with generated data ' + n, function () {
        var generated_json = json_schema_faker(schema);
        // need to force a valid centre
        generated_json.centre = 'harmondsworth';
        return request(sails.hooks.http.app)
          .post('/IrcPost')
          .send(generated_json)
          .expect(200)
          .toPromise()
          .catch(function (error) {
            error.message += JSON.stringify(generated_json, null, " ");
            throw error;
          });
      });
    });
  });

  describe('all scenarios should fail json schema check', function () {
    var scenarios = [
      {invalid_ref_missing: require('../../scenarios/invalid_ref_missing.json')},
      {invalid_reason_missing: require('../../scenarios/invalid_reason_missing.json')},
      {invalid_json_additional_properties: require('../../scenarios/invalid_json_additional_properties.json')},
      {invalid_negative_number: require('../../scenarios/invalid_negative_number.json')},
      {invalid_floting_number: require('../../scenarios/invalid_floting_number.json')}

    ];

    return _.map(scenarios, function (scenario) {
      return it(Object.keys(scenario)[0] + ' should pass json schema check', function () {
        return request(sails.hooks.http.app)
          .post('/IrcPost')
          .send(scenario[Object.keys(scenario)[0]])
          .expect(400);

      });
    });
  });

  describe('Updating the centre model', function () {
    it('should update the centre model with available bed counts', function () {

      update_json = _.assign(require('../../scenarios/bed_in_of_commission.json'), {
        centre: 'bigone',
        bed_counts: {
          male: 10,
          female: 20,
          out_of_commission: {
            ooc_male: 10,
            ooc_female: 10
          }
        }
      });
      return request(sails.hooks.http.app)
        .post('/IrcPost')
        .send(update_json)
        .expect(200)
        .then(function () {
          return expect(Centre.findOne({name: 'bigone'}))
            .to.eventually.contain({
              female_in_use: 20,
              female_out_of_commission: 10,
              male_in_use: 10,
              male_out_of_commission: 10
            });
        });
    });
  });
});
