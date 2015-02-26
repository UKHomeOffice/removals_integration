var Sequelize = require('sequelize'),
    db = require('./db'),
    sequelize = db.sequelize;

var Nationality = sequelize.define('Nationality', {
    nationality: Sequelize.STRING
});

var Centre = sequelize.define('Centre', {
    name: { type: Sequelize.STRING, unique: true },
    current_beds_male: Sequelize.INTEGER,
    current_beds_female: Sequelize.INTEGER,
    current_beds_ooc: Sequelize.INTEGER
});

var Person = sequelize.define('Person', {
    cid_id: { type: Sequelize.STRING, unique: true },
    gender: Sequelize.ENUM('m', 'f')
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
    Centre: Centre,
};
