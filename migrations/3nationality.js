CONFIG = require(process.cwd()+'/node/config').config; 
var models = require(process.cwd()+'/node/models').models;

module.exports = {
  up: function(migration, DataTypes, done) {
    // logic for transforming into the new state
    models.Nationality.sync();
    done() // sets the migration as finished
  },
 
  down: function(migration, DataTypes, done) {
    // logic for reverting the changes
    models.Nationality.drop();
    done() // sets the migration as finished
  }
}
