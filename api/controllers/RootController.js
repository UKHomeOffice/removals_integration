'use strict';
var _ = require('lodash');

module.exports = {
  index: (req, res) => {
    /* eslint no-param-reassign:0 */
    res.customfields = {id: 'links.centres', value: '/centres', transforms: ['baseurl']};
    _.set(req, 'options.criteria.blacklist', ['limit', 'skip', 'sort', 'populate', 'nginxId']);
    /* eslint no-param-reassign:2 */
    return res.ok();
  }
};
