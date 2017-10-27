'use strict';

module.exports = {
  index: (req, res) => {
    /* eslint no-param-reassign:0 */
    res.customfields = [
      {
        id: 'links.centres',
        value: '/centres',
        transforms: ['baseurl']
      },
      {
        id: 'links.health',
        value: '/health',
        transforms: ['baseurl']
      },
      {
        id: 'links.heartbeat',
        value: '/heartbeat',
        transforms: ['baseurl']
      },
      {
        id: 'links.bedevent',
        value: '/bedevent',
        transforms: ['baseurl']
      },
      {
        id: 'links.cid_entry',
        value: '/cid_entry',
        transforms: ['baseurl']
      },
      {
        id: 'links.irc_entry',
        value: '/irc_entry',
        transforms: ['baseurl']
      },
      {
        id: 'links.depmu_entry',
        value: '/depmu_entry',
        transforms: ['baseurl']
      }
    ];
    /* eslint no-param-reassign:2 */
    return res.ok();
  }
};
