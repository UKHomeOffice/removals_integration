'use strict';

const okCode = 200;
const okEmptyCode = 204;
const okPostCode = 201;

var jsonApiResponse = require('../lib/helpers/json-api-response');

module.exports = function sendOK (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  var method = req.method;
  var statusCode = okCode;
  var JSONresponse = jsonApiResponse(req, res, data);
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
