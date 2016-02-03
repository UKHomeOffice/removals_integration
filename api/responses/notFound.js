'use strict';

const notFoundCode = 404;

module.exports = function notFound (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  res.status(notFoundCode);

  if (data === undefined) {
    sails.log.verbose('Sending 404 ("Not Found") response');
  } else {
    sails.log.verbose('Sending 404 ("Not Found") response: \n', data);
  }

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  return res.jsonx(data);
};
