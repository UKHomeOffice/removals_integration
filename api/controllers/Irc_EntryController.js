/**
 * IrcPostController
 *
 * @description :: Server-side logic for managing ircposts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var ValidationError = require('../lib/exceptions/ValidationError');

module.exports = {

  index: function (req, res) {
    return res.ok;
  },


  process_heartbeat: function (request_body) {
    return Centre.getByName(request_body.centre)
      .then(function (centre) {
        centre.male_in_use = request_body.male_occupied;
        centre.female_in_use = request_body.female_occupied;
        centre.male_out_of_commission = request_body.male_outofcommission;
        centre.female_out_of_commission = request_body.female_outofcommission;
        return centre.save();
      });
  },

  heartbeat: function (req, res) {
    var response = IrcEntryHeartbeatValidatorService.validate(req.body)
      .catch(ValidationError, function (error) {
        res.badRequest(error.message);
        return response.cancel();
      })
      .catch(function (error) {
        res.serverError(error.message);
        return response.cancel();
      })
      .then(this.process_heartbeat)
      .tap(function () {
        sails.sockets.blast('wallboardUpdate');
      })
      .then(res.ok);
    return response;
  },

  process_event: function (request_body) {

  }
};
