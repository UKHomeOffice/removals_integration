var map= {
        'DB_USER' : 'username',
        'DB_PASSWORD' : 'password',
        'DB_HOST' : 'host',
        'DB_NAME' : 'database',
    },
    get_from_env = Object.keys(map),
    directory_path_components = process.cwd().split('/'),
    project_path = process.cwd(), //directory_path_components.slice(0, directory_path_components.length -1).join('/'),
    cur_env = process.env.NODE_ENV || "development",
    config = {},
    v;

for(v in get_from_env) {
    if (get_from_env.hasOwnProperty(v)) {
        var key = get_from_env[v];
        if (process.env[key]) {
            console.log("setting " + key + " to " + process.env[key]);
            config[map[key]] = process.env[key];
        } else {
            console.log("No environment variable " + key + ". Using config.json.");
            config = require('../config/config.json')[cur_env];
            break;
        }
    }
}

CONFIG = {
    project_path: project_path,
    db: {
        name: config.database,
        user: config.username,
        password: config.password
    }
};
console.log(CONFIG);

exports.config = CONFIG;
