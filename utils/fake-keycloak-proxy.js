var http = require('http');
var httpProxy = require('http-proxy');

module.exports = (dest, keycloakConfig) => {
  var proxy = httpProxy.createProxyServer({
    target: dest,
    headers: {
      'x-auth-roles': keycloakConfig.roles.join(',')
    }
  });
  
  proxy.on('error', () => {}); // To keep it from erroring when the socket is closed unexpectedly (Socket IO) 
  
  return proxy;
};
