var CONFIG = require('./config').config,
    exec = require("child_process").exec,
    jade = require("jade");
var data_reader = require("../models/data_reader.js");

var controllers = {
    chicken: function(request, response) {
        console.log("cluck cluck");
        var DR = new data_reader();
        DR.get_centres(function(list){
            var j = jade.compileFile('./templates/dashboard.jade', {});
            var html = j({"list":list,"name":"chicken"});
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
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
        console.log("Inside handlePost");
        var postData = "";
        request.setEncoding("utf8");
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Received POST data chunk '"+ postDataChunk + "'.");
        });
        request.addListener("end", function() {
            var render = jade.compileFile(CONFIG.project_path + 'templates/base.jade', {
                globals: [], // list of global variable names
                pretty: true
            });
            var html = render({
                title: "post response",
                name: "sausage",
                body: postData
            });

            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        });

    }
};
exports.controllers = controllers;
