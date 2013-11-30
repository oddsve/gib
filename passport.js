var passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy;

module.exports = passport;

var config = require('./config');

var options = {
  clientID: config.get('github:clientid'),
  clientSecret: config.get('github:clientsecret')
};

passport.use(new GitHubStrategy(options, function (accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken;
  return done(null, profile);
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});
