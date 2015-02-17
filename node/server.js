var http = require("http"),

    routing = require('./routing'),

    server;


function start(port) {
    port = port || 8888;

    if (server) stop();

    server = http.createServer(routing.route).listen(port);
    
    console.log("Server has started.");
}

function stop() {
    if (!server) return;

    server.destroy();

    console.log('Server stopped');
}

exports.start = start;