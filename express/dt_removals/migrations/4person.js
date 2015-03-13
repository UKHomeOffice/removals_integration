CONFIG = require(process.cwd()+'/config/config').config; 
var models = require(process.cwd()+'/lib/models').models;

module.exports = {
  up: function(migration, DataTypes, done) {
    // logic for transforming into the new state
    models.Person.sync();
    done(); // sets the migration as finished
  },
 
  down: function(migration, DataTypes, done) {
    // logic for reverting the changes
    models.Person.drop();
    done(); // sets the migration as finished
  }
};
