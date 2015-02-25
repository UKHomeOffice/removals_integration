var Sequelize = require('sequelize'),
    sequelize = require('./db').sequelize;

var models = {
    User: sequelize.define('User', {
        username: Sequelize.STRING,
        password: Sequelize.STRING
    })
};
/*
sequelize
    .sync({ force: true });
*/
exports.models = models;
