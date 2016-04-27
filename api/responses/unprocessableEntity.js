'use strict';

const unprocessableEntityCode = 422;
const unprocessableEntityMessage = 'Unprocessable Entity';

module.exports = function unprocessableEntity (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  res.status(unprocessableEntityCode);

  if (data === undefined) {
    sails.log.verbose(`Sending "${unprocessableEntityCode}" ("${unprocessableEntityMessage}") response`);
  } else {
    sails.log.verbose(`Sending "${unprocessableEntityCode}" ("${unprocessableEntityMessage}") response: \n`, data);
  }

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  return res.jsonx(data);
};

