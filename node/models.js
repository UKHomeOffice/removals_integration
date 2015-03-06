var Sequelize = require('sequelize'),
    db = require('./db').db,
    sequelize = db.sequelize;

var Nationality = sequelize.define('Nationality', {
    name: { type: Sequelize.STRING, unique: true },
    code: { type: Sequelize.STRING(3), unique: true },
    valid_from: { type: Sequelize.DATE, allowNull: true },
    valid_to: { type: Sequelize.DATE, allowNull: true },
    replaced_by: Sequelize.STRING(3),
    also_included: Sequelize.STRING,
    notes: Sequelize.STRING
});

var Centre = sequelize.define('Centre', {
    name: { type: Sequelize.STRING, unique: true },
    current_beds_male: Sequelize.INTEGER,
    current_beds_female: Sequelize.INTEGER,
    current_beds_ooc: Sequelize.INTEGER,
    material: Sequelize.STRING
});

var Person = sequelize.define('Person', {
    cid_id: { type: Sequelize.STRING, unique: true },
    gender: Sequelize.ENUM('m', 'f', 'u', 'n')
});
Person.hasMany(Nationality);
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
