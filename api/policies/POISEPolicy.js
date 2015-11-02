/**
 * Allow any known POISE authenticated user.
 */
module.exports = (req, res, next) =>
  PassportService.authenticate('POISE', {session: false}, (err, user) => {
    if (err || user === false) {
      res.forbidden();
    }
    else {
      next();
    }
  })(req, res);
