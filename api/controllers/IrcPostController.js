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
   * `IrcPostController.post()`
   */
  post: function (req, res) {
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
    console.log(request_body.bed_counts);
    return request_body;
  },
};