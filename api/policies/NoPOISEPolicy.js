var _ = require('lodash');
/**
 * Forbid any POISE authenticated user.
 */
module.exports = (req, res, next) => {
  if (_.get(req, 'headers.http_email') || _.get(req, 'socket.handshake.headers.http_email')) {
    res.forbidden();
  }
  else {
    next();
  }
}
