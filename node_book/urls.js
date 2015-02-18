var controllers = require("./controllers").controllers;
var urls = {
    "/": controllers.start,
    "/start": controllers.start,
    "/upload": controllers.upload
};

exports.urls = urls;