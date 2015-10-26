/**
 * Allow any known POISE authenticated user.
 */
module.exports = function (req, res, next) {
  PassportService.authenticate('POISE', {session: false}, function (err, user) {
    if (err || user === false) {
      res.forbidden();
    }
    else {
      next();
    }
  })(req, res);
};
