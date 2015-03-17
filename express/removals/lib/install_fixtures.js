var models = require('./models').models,
    utils = require('./utils').utils;

function installFixtures () {
    utils.import_csv(
        /*CONFIG.project_path + '/fixtures/nationalities.csv',
         models.Nationality,
         true,
         null*/
        './fixtures/centres.csv',
        models.Centre,
        true,
        null
    );
}

exports.installFixtures = installFixtures;
