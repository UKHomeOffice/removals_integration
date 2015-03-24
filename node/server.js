var http = require("http");
var url = require("url");
var router = require("./router").doRouting;

function start() {

    function listener(request, response) {
        var path = url.parse(request.url).pathname,
            controllerMap,
            argument,
            controller;
        console.log("Request for " + path + " received.");
        controllerMap = router(path, response);
        controller= controllerMap.controller;
        argument = controllerMap.argument;

        if (typeof controller === 'function') {
            controller(request, response, argument);
        } else {
            console.log("No request handler found for " + path);
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        }
    }

    http.createServer(listener).listen(8888);
    console.log("Server has started.");
}

exports.start = start;