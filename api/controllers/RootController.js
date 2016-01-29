'use strict';

module.exports = {
  index: (req, res) => {
    /* eslint no-param-reassign:0 */
    res.links.centres = '/centres';
    return res.ok();
  }
};
