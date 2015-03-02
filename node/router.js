var urls = require("./urls").urls,
    routeRegexes = Object.keys(urls);


function doRouting(path, response) {
    var slug, i, controller, r;

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

    return controller;
}

exports.doRouting = doRouting;
