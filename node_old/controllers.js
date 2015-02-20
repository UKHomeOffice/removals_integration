var url = require('url'),

    routing = require('./routing');

var genericController = function(request, response, bodyText) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(bodyText);
    response.end();
};

var controllers = {
    bland: function (request, response) {
        return genericController(request, response, "Bland");
    },
    fancy: function(request, response) {
        return genericController(request, response, "Fancy");
    }
};

exports.controllers = controllers;