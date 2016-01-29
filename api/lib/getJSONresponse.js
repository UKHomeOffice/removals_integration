'use strict';

module.exports = function getJSONresponse (req, res, data) {
  return {
    links: _.extend({
      self: req.baseUrl + req.url
    }, res.links),
    data: data
  };
};
