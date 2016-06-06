'use strict';

const UserRoles = require('../services/UserRoles');

const middleware = (req, res, next) => {
  req.permissions = [];
  const rolesString = req.headers['X-Auth-Roles'];

  if (rolesString) {
    req.permissions = req.permissions.concat(UserRoles.getPermissions(rolesString.split(',')));
  }

  next();
};

module.exports = middleware;
