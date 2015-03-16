var Sequelize = require('sequelize'),
    db = require('../config/db').db,
    sequelize = db.sequelize;

var Nationality = sequelize.define('nationality', {
    name: { type: Sequelize.STRING, unique: true },
    code: { type: Sequelize.STRING(3), unique: true },
    valid_from: { type: Sequelize.DATE, allowNull: true },
    valid_to: { type: Sequelize.DATE, allowNull: true },
    replaced_by: Sequelize.STRING(3),
    also_included: Sequelize.STRING,
    notes: Sequelize.STRING
});

var Centre = sequelize.define('centre', {
    name: { type: Sequelize.STRING, unique: true },
    operator: Sequelize.STRING(30), // eg mitie
    capacity: Sequelize.INTEGER,
    capacity_female: Sequelize.INTEGER,
    reservable: { type: Sequelize.BOOLEAN, default: false },
    fast_track: { type: Sequelize.BOOLEAN, default: false },
    unisex: { type: Sequelize.BOOLEAN, default: false },
    current_beds_male: Sequelize.INTEGER,
    current_beds_female: Sequelize.INTEGER,
    current_beds_ooc: Sequelize.INTEGER
});

var Person = sequelize.define('person', {
    cid_id: { type: Sequelize.STRING, unique: true },
    gender: Sequelize.ENUM('m', 'f', 'u', 'n')
});
Nationality.hasMany(Person);
Centre.hasOne(Person, {
    as: 'current_location'
});

exports.models = {
    Person: Person,
    Nationality: Nationality,
    Centre: Centre,
};
