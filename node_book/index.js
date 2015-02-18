var server = require("./server");
var urls = require("./urls").urls;
var router = require("./router").doRouting;

server.start(router, urls);