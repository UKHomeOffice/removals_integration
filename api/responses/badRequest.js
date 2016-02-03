'use strict';

const badRequestCode = 400;

module.exports = function badRequest (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  res.status(badRequestCode);

  if (data === undefined) {
    sails.log.verbose('Sending 400 ("Bad Request") response');
  } else {
    sails.log.verbose('Sending 400 ("Bad Request") response: \n', data);
  }

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  return res.jsonx(data);
};

