/**
 * Allow any known POISE authenticated user.
 */
module.exports = function (req, res, next) {
  PassportService.authenticate('POISE', {session: false}, function (err, user, info) {
    if (user === false) {
      res.forbidden();
    }
    else {
      next();
    }
  })(req, res);
};
