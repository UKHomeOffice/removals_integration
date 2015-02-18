var http = require("http");
var url = require("url");

function start(router, urls) {
    function listener(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + pathname + " received.");
        router(urls, pathname, response);
    }
    http.createServer(listener).listen(8888);
    console.log("Server has started.");
}

exports.start = start;