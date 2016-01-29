/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

var getJSONresponse = require('../lib/getJSONresponse');

module.exports = function sendOK(data, options) {

  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  var method = req.method;
  var statusCode = 200;
  var JSONresponse = getJSONresponse(req, res, data);
  var isEmpty = _.isEmpty(JSONresponse);

  if (method === 'DELETE' && isEmpty) {
    statusCode = 204;
  }

  if (method === 'PUT' && isEmpty) {
    statusCode = 204;
  }

  if (method === 'POST') {
    statusCode = 201;
  }

  sails.log.silly('res.ok() :: Sending ' + statusCode + ' ("OK") response');
  res.status(statusCode);

  return res.jsonx(JSONresponse);
};
