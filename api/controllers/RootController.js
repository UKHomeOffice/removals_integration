'use strict';

module.exports = {
  index: (req, res) => {
    res.links.centres = '/centres';
    return res.ok();
  }
};
