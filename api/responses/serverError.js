'use strict';

/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

const serverErrorCode = 500;

module.exports = function serverError (data, options) {
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  options = options || {};

  res.status(serverErrorCode);

  if (data === undefined) {
    sails.log.error('Sending empty 500 ("Server Error") response');
  } else {
    sails.log.error('Sending 500 ("Server Error") response: \n', data);
  }

  // Only include errors in response if application environment
  // is not set to 'production'.  In production, we shouldn't
  // send back any identifying information about errors.
  if (sails.config.environment === 'production') {
    data = undefined;
  }

  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  // If second argument is a string, we take that to mean it refers to a view.
  // If it was omitted, use an empty object (`{}`)
  if (typeof options === 'string') {
    options = {view: options};
  }

  // If a view was provided in options, serve it.
  // Otherwise try to guess an appropriate view, or if that doesn't
  // work, just send JSON.
  if (options.view) {
    return res.view(options.view, { data: data });
  }
  // If no second argument provided, try to serve the default view,
  // but fall back to sending JSON(P) if any errors occur.
  return res.view('500', { data: data }, function (err, html) {
    // If a view error occured, fall back to JSON(P).
    if (err) {
      // If the view was missing, ignore the error but provide a verbose log.
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.serverError() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
      } else {
        // Otherwise, if this was a more serious error, log to the console with the details.
        sails.log.warn('res.serverError() :: When attempting to render error page view, an error occured (sending JSON instead). Details: ', err);
      }
      return res.jsonx(data);
    }
    return res.send(html);
  });
};
