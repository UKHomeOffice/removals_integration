var CONFIG = require('./config').config,
    exec = require("child_process").exec,
    jade = require("jade");
var data_reader = require("../models/data_reader.js");
var json_wrangler = require("../models/json_wrangler.js");

var controllers = {
    diagnostics: function(request, response) {
        var msg = '';
        for(i in process.env){
            msg += i + ": " + process.env[i] + "\n";
        }
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(msg);
        response.end();
    },
    dashboard: function(request, response) {
        console.log("cluck cluck");
        var DR = new data_reader();
        DR.get_centres(function(list){
            var j = jade.compileFile('./templates/dashboard.jade', {});
            var html = j({"list":list,"name":"chicken",pageTitle:"Dashboard"});
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(html);
            response.end();
        });
    },
    updateCentres: function(request, response) {
        console.log("handling Centre update");
        var body = '';
        var postData = "";
        request.setEncoding("utf8");
        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            var code = 200;
            console.log("Received POST data chunk '"+ postDataChunk + "'.");
            JW = new json_wrangler(true);
            try{
                JW.consume(postData,function(success, error){})
                    .then(function(obj){
                        var body = '{"status":"OK"}';
                        response.writeHead(code, {"Content-Type": "application/json"});
                        response.write(body);
                        response.end();
                    })
                    .then(function(){
                        console.log("ABOUT TO UPDATE");
                        JW.update_centres();
                    })
                    .then(null,function(err){
                        console.log("Rejected "+err);
                        code = 404;
                        response.writeHead(code, {"Content-Type": "application/json"});
                        response.write('{"status":"ERROR","error":"'+err+'"}');
                        response.end();
                });
            }catch(err){
                console.log("GOT ERROR " + err);
                code = 400;
                response.writeHead(code, {"Content-Type": "application/json"});
                response.write('{"status":"ERROR","error":"'+err+'"}');
                response.end();
            }
/*
            response.writeHead(code, {"Content-Type": "text/html"});
            response.write(body);
            response.end();
*/
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
