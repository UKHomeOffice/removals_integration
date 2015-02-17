var params = require('querystring'),
    url = require('url'),

    controllers = require('./controllers').controllers,

    map = {
        '^$' : controllers.bland, // root
        '.+' : controllers.fancy // anything else
    },

    routes = Object.keys(map);

function route(request, response) {
    var path, slug, i, controller, r;

    path = url.parse(request.url).path;
    console.log("Request for " + path);
    path = path.slice(1); // kill leading slash
    slug = path.split('/')[0];
    console.log("About to route a request for %s", slug);

    for (i = 0; i < routes.length; i++) {
        r = routes[i];
        if (slug.match(r)) {
            controller = map[r];
            break;
        }
    }
    if (controller) {
        controller(request, response);
    } else {
        throw new EventException();
    }
}

// cannot set function as value of exports, as Object expected
exports.route = route;