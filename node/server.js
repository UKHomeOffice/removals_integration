var http = require("http");
var url = require("url");
var router = require("./router").doRouting;

function start() {

    function listener(request, response) {
        var path = url.parse(request.url).pathname,
            controller;
        console.log("Request for " + path + " received.");
        controller = router(path, response);

        if (typeof controller === 'function') {
            controller(request, response);
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