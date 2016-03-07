var Promise = require('bluebird');
var Sails = require('sails');

var lift = Promise.promisify(Sails.lift);

lift({
  hooks: {
    grunt: false,
    i18n: false,
    views: false
  }
})
  .then(sails => Promise.promisify(sails.lower)())
  .then(sails => process.exit(0));
