var exec = require("child_process").exec;
var controllers = {
    remoteApi: function(request, response) {
        console.log("API request");
        response.writeHead(200, {"Content-Type": "text/json"});
        fs = require('fs');
        fs.readFile('sample_input.json','utf8',function(err,data){
            if(err){
                return console.log(err);
            }
            else{
                response.write(data);
            }
        });
    },
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
        console.log("INside handlePost");
        var postData = "";
        request.setEncoding("utf8");
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '"+ postDataChunk + "'.");
        });
        request.addListener("end", function() {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(postData);
            response.end();
        });

    }
};
exports.controllers = controllers;
