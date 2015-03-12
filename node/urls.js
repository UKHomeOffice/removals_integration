var controllers = require("./controllers").controllers;
var urls = {
    "^$": controllers.start,
    "start": controllers.start,
    "dashboard": controllers.dashboard,
    "diagnostics": controllers.diagnostics,
    "upload": controllers.handlePost,
    "update_centres": controllers.updateCentres
};

exports.urls = urls;
