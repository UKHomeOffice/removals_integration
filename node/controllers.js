var exec = require("child_process").exec;
var jade = require("jade");
var controllers = {
    start: function(request, response) {
        console.log("Request handler 'start' was called.");
        exec("find /",
            { timeout: 10000, maxBuffer: 20000 * 1024 }, function (error, stdout, stderr) {
                response.writeHead(200, {"Content-Type": "text/plain"});
                response.write(stdout);
                response.end();
            }
        );
    },
    handlePost: function(request, response) {
        console.log("Inside handlePost");
        var postData = "";
        request.setEncoding("utf8");
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '"+ postDataChunk + "'.");
        });
        request.addListener("end", function() {
            response.writeHead(200, {"Content-Type": "text/html"});

            var render = jade.compileFile(CONFIG.project_path + 'templates/base.jade', {
                globals: [], // list of global variable names
                pretty: true
            });
            var html = render({
                title: "post response",
                name: "sausage",
                body: postData
            });

            response.write(html);
            response.end();
        });

    }
};
exports.controllers = controllers;