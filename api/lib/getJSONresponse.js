'use strict';

module.exports = function getJSONresponse (req, data) {
  return {
    links: {
      self: req.baseUrl + req.url
    },
    data: data
  };
};
