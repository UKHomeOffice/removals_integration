'use strict';

const serverErrorCode = 500;

module.exports = function serverError (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  res.status(serverErrorCode);

  if (data === undefined) {
    sails.log.error('Sending empty 500 ("Server Error") response');
  } else {
    sails.log.error('Sending 500 ("Server Error") response: \n', data);
  }

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  return res.jsonx(data);
};
