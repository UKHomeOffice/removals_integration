'use strict';

/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

const forbiddenCode = 403;

module.exports = function forbidden (data) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  res.status(forbiddenCode);

  if (data === undefined) {
    sails.log.verbose('Sending 403 ("Forbidden") response');
  } else {
    sails.log.verbose('Sending 403 ("Forbidden") response: \n', data);
  }

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  return res.jsonx(data);
};
