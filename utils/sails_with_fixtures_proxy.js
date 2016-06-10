var Sails = require('sails');
var Barrels = require('barrels');
var keycloakProxy = require('./fake-keycloak-proxy');

Sails.lift(
  {
    port: 8081,
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  },
  function (err, sails) {
    var barrels = new Barrels();
    barrels.populate([
      'centres',
      'detainee',
      'event',
      'movement',
      'heartbeat',
      'prebooking'
    ], function (err) {
      sails.log('up');
    });
    keycloakProxy('http://127.0.0.1:8081', {
      roles: ['full_access']
    }).listen(8080);
  }
);
