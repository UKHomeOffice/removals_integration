'use strict';

var jsonApiResponse = require('../lib/helpers/json-api-response');

const okCode = 200;
const okPostCode = 201;
const okEmptyCode = 204;


var codes = {
  delete: {
    empty: okEmptyCode,
    full: okCode
  },
  put: {
    empty: okEmptyCode,
    full: okCode
  },
  post: {
    empty: okPostCode,
    full: okPostCode
  }
};

var getStatusCode = (method, isEmpty) => {
  var satiety = isEmpty ? 'empty': 'full';
  if (codes[method]) {
    return codes[method][satiety];
  }
  return okCode;
};

module.exports = function sendOK (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;
  var method = req.method.toLowerCase();
  var json = jsonApiResponse(req, res, data);
  var isEmpty = _.isEmpty(json);
  var statusCode = getStatusCode(method, isEmpty);

  sails.log.silly('res.ok() :: Sending ${statusCode} ("OK") response');

  res.status(statusCode);

  return res.jsonx(json);
};
