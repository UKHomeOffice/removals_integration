var Sequelize = require('sequelize'),
    sequelize = require('./db').sequelize;

var Nationality= sequelize.define('Nationality', {
    nationality: Sequelize.STRING
});

var Centre = sequelize.define('Centre', {
    name: Sequelize.STRING,
    current_beds_male: Sequelize.INTEGER,
    current_beds_female: Sequelize.INTEGER,
    current_beds_ooc: Sequelize.INTEGER
});

var Person = sequelize.define('Person', {
        cid_id: Sequelize.STRING,
        gender: Sequelize.STRING(1)
    });
Person.hasOne(Nationality);
Person.hasOne(Centre, {
    as: 'current_location'
});



/*sequelize
    .sync({ force: true });*/

exports.models = {
    Person: Person,
    Nationality: Nationality,
    Centre: Centre
};