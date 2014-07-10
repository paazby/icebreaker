var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = require('./internal-files').FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = require('./internal-files').FACEBOOK_APP_SECRET;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:4568/auth/facebook/callback"
  }, function(accessToken, refreshToken, profile, done) {
    // TODO: In a typical application, you would want
    // to associate the Facebook account with a user record in your database,
    // and return that user instead.
    console.log('profile', profile);
    return done(null, profile);
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/auth/facebook')
}

module.exports.passport = passport;
module.exports.ensureAuthenticated = ensureAuthenticated;