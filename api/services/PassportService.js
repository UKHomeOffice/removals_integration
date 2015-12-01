var passport = require('passport');
var POISEStrategy = require('passportjs-header').Strategy;

module.exports = passport.use(new POISEStrategy(
  (userid, done) => User.findOne(userid, done)
));

