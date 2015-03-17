var models = require('./models').models,
    utils = require('./utils').utils;

function installFixtures (wipeDb) {
    utils.import_csv(
       './fixtures/centres.csv',
       models.Centre,
       wipeDb,
       null
    );
    utils.import_csv(
        './fixtures/nationalities.csv',
        models.Nationality,
        wipeDb,
        null
    );
}

exports.installFixtures = installFixtures;
