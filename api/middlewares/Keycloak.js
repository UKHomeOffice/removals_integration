'use strict';

const UserRoles = require('../services/UserRoles');

const middleware = (req, res, next) => {
  req.session.permissions = [];
  var rolesString = req.headers['x-auth-roles'];

  if (rolesString) {
    req.session.permissions = req.session.permissions.concat(UserRoles.getPermissions(rolesString.split(',')));
  }

  next();
};

module.exports = middleware;
