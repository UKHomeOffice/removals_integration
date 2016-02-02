'use strict';

module.exports = (req, res, data) => {
  res.customfields = {id: 'links.self', value: req.url, transforms: ['baseurl']};
  return _.extend(res.customfields, {data: data});
};
