var http = require("http");
var url = require("url");
var router = require("./router").doRouting;

function start() {

    function listener(request, response) {
        var path = url.parse(request.url).pathname;
        console.log("Request for " + path + " received.");
        router(path, response);
    }

    http.createServer(listener).listen(8888);
    console.log("Server has started.");
}

exports.start = start;