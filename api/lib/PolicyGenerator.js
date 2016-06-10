'use strict';

module.exports = (permissionRequired) => (req, res, next) => {
  if (req.session.permissions.indexOf(permissionRequired) < 0) {
    return res.forbidden();
  }
  next();
};
