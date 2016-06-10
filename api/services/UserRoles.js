'use strict';

const _ = require('lodash');
const IRC_PREFIX = 'irc_';

const centreReadPermissionGenerator = (centreName) => `centres.${centreName}.read`;
module.exports = {
  IRC_PREFIX,
  permissions: {
    data_cid: ['Cid_EntryController'],
    data_irc: ['Irc_EntryController', 'HeartbeatController'],
    data_depmu: ['Depmu_EntryController'],
    full_access: [
      'centres.*.read',
      'Cid_EntryController',
      'Irc_EntryController',
      'Depmu_EntryController',
      'CentresController',
      'HeartbeatController',
      'HealthController',
      'RootController'
    ]
  },
  getPermissions: function (role) {
    const permissions = [];
    if (Array.isArray(role)) {
      return _.chain(role)
        .map((v) => this.getPermissions(v))
        .flatten()
        .uniq()
        .value();
    }

    if (role.startsWith(IRC_PREFIX)) {
      const centreName = role.substring(IRC_PREFIX.length);
      permissions.push(centreReadPermissionGenerator(centreName));
    }

    return permissions.concat(this.permissions[role] || []);
  }
};
