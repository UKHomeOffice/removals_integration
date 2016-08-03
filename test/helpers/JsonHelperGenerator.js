'use strict';

var _ = require('lodash');

module.exports = function (schema, custom_fakes) {
  var jsf = require('json-schema-faker');
  _.mapKeys(custom_fakes, function (fake, key) {
    if (!_.isFunction(fake)) {
      custom_fakes[key] = function () {
        return fake;
      };
    }
  });
  jsf.extend('faker', function (faker) {
    faker.custom = custom_fakes;
    return faker;
  });
  return jsf(schema);
}
