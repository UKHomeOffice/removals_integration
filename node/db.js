CONFIG = require('./config').config;
var Sequelize = require('sequelize');
var sequelize = new Sequelize(CONFIG.db.name, CONFIG.db.user, CONFIG.db.password, {
        dialect: "mysql",
        port:    3306,
    });

sequelize
    .authenticate()
    .complete(function(err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    });


exports.db = {
    sequelize : sequelize,
};
