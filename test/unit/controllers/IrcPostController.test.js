var request = require('supertest');
var _ = require('lodash');

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
});
