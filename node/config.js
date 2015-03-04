var map= {
        'DB_USER' : 'username',
        'DB_PASSWORD' : 'password',
        'DB_HOST' : 'host',
        'DB_NAME' : 'database',
    },
    get_from_env = Object.keys(map);
var cur_env       = process.env.NODE_ENV || "development";
var config = {};
for(var v in get_from_env) {
    var key = get_from_env[v];
    if(process.env[key]){
        console.log("setting " + key + " to " + process.env[key]);
        config[map[key]] = process.env[key];
    } else {
        console.log("No environment variable " + key + ". Using config.json.");
        var config    = require('../config/config.json')[cur_env];
        break;
    }
}

CONFIG = {
    project_path: process.cwd(),
    db: {
        name: config.database,
        user: config.username,
        password: config.password
    }
};
console.log(CONFIG);

exports.config = CONFIG;

// even though the CONFIG object is global, we return it here for use on the command line
