/**
 * IrcPostController
 *
 * @description :: Server-side logic for managing ircposts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise;
Promise = require('bluebird');
module.exports = {

  /**
   * `IrcPostController.index()`
   */
  index: function (req, res) {
    return IrcRequestValidatorService.validate(req.body)
      .tap(this.process_operation)
      .tap(this.process_bed_counts)
      .catch(function (e) {
        return res.badRequest(e);
      })
      .finally(function () {
        return res.ok();
      });
  },

  process_operation: function (request_body) {
    return this['process_operation_' + request_body.operation];
  },

  process_operation_ooc: function (request_body) {
    return request_body;
  },
  process_operation_bic: function (request_body) {
    return request_body;
  },
  process_operation_in: function (request_body) {
    return request_body;
  },
  process_operation_out: function (request_body) {
    return request_body;
  },
  process_operation_tra: function (request_body) {
    return request_body;
  },
  process_bed_counts: function (request_body) {
    return Centre.findOne({name: request_body.centre})
      .then(function (centre) {
        centre.male_in_use = request_body.bed_counts.male;
        centre.female_in_use = request_body.bed_counts.female;
        centre.male_out_of_commission = request_body.bed_counts.out_of_commission.ooc_male;
        centre.female_out_of_commission = request_body.bed_counts.out_of_commission.ooc_female;
        return centre.save();
      }).finally(function () {
        return request_body;
      });
  },
};