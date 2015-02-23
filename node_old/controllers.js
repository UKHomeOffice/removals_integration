var _genericController = function(request, response, bodyText) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(bodyText);
    response.end();
};

var controllers = {
    bland: function (request, response) {
        return _genericController(request, response, "Bland");
    },
    fancy: function(request, response) {
        return _genericController(request, response, "Fancy");
    }
};

exports.controllers = controllers;