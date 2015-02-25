var controllers = require("./controllers").controllers;
var urls = {
    "^$": controllers.start,
    "start": controllers.start,
    "upload": controllers.handlePost,
    "remote-api": controllers.remoteApi,
    "consume": controllers.consumeRemoteJson
};

exports.urls = urls;
