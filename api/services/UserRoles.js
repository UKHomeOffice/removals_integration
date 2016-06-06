'use strict';

const _ = require('lodash');

module.exports = {
  permissions: {
    data_cid: ['controller.cid_entry'],
    data_irc: ['controller.irc_entry']
  },
  getPermissions: function (role) {
    if (Array.isArray(role)) {
      return _.chain(role)
        .map((v) => this.getPermissions(v))
        .flatten()
        .uniq()
        .value();
    }
    return this.permissions[role] || [];
  }
};
