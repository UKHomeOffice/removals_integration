var urls = require("./urls").urls,
    routeRegexes = Object.keys(urls);


function doRouting(path, response) {
    var slug, i, controller, r;

    console.log("About to route a request for " + path);
    path = path.slice(1); // kill leading slash
    slug = path.split('/')[0]; // TODO: handle more complex paths
    console.log("About to route a request for %s", slug);

    for (i = 0; i < routeRegexes.length; i++) {
        r = routeRegexes[i];
        if (slug.match(r)) {
            controller = urls[r];
            break;
        }
    }

    if (typeof controller === 'function') {
        controller(response);
    } else {
        console.log("No request handler found for " + path);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.doRouting = doRouting;
