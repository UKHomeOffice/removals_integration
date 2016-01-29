'use strict';

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
const okCode = 200;
const okEmptyCode = 204;
const okPostCode = 201;

var getJSONresponse = require('../lib/getJSONresponse');

module.exports = function sendOK (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  var method = req.method;
  var statusCode = okCode;
  var JSONresponse = getJSONresponse(req, res, data);
  var isEmpty = _.isEmpty(JSONresponse);

  if (method === 'DELETE' && isEmpty) {
    statusCode = okEmptyCode;
  }

  if (method === 'PUT' && isEmpty) {
    statusCode = okEmptyCode;
  }

  if (method === 'POST') {
    statusCode = okPostCode;
  }

  sails.log.silly('res.ok() :: Sending ${statusCode} ("OK") response');
  res.status(statusCode);

  return res.jsonx(JSONresponse);
};
