'use strict';

module.exports = {
  index: (req, res) => {
    /* eslint no-param-reassign:0 */
    res.customfields = {id: 'links.centres', value: '/centres', transforms: ['baseurl']};
    /* eslint no-param-reassign:2 */
    return res.ok();
  }
};
