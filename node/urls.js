var controllers = require("./controllers").controllers;
var urls = {
    "^$": controllers.start,
    "start": controllers.start,
    "chicken": controllers.chicken,
    "upload": controllers.handlePost,
    "update_centres": controllers.updateCentres
};

exports.urls = urls;
