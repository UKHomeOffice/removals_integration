var urls = require("./urls").urls,
    routeRegexes = Object.keys(urls);


function doRouting(path) {
    var slug, i, controller, r, match, response;

    path = path.slice(1); // kill leading slash
    slug = path;//.split('/')[0]; // TODO: handle more complex paths
    console.log("About to route a request for %s", slug);

    for (i = 0; i < routeRegexes.length; i++) {
        r = routeRegexes[i];
        match = slug.match(r);
        if (match) {
            controller = urls[r];
            break;
        }
    }

    response = {
        controller: controller,
        argument: match ? match[1] : null
    };

    return response;
}

exports.doRouting = doRouting;
