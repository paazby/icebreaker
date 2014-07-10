var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = require('./internal-files').FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = require('./internal-files').FACEBOOK_APP_SECRET;
var User = require('../app/models/user');

// Once authentication succeeds, a session will be established and maintained
// via a cookie set in the user's browser.
// Subsequent requests do not contain credentials but rather the unique
// cookie that identifies the session. Passport will serialize and 
// deserialize user instances to and from the session
// Only the user ID is serialize to the session. When subsequent requests 
// are received the ID is used to find the user, which will be restored
// to req.user

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
    // Verify callback
    // the purpose of a verify callback is to find the user that possess a set
    // of credentials. When Passport authenticates a request it parses the 
    // credentials contained in the request. It then invokes the verify callback
    // with those credentials as arguments. If the credentials are valid
    // the verify callback invokes done
    // TODO: In a typical application, you would want
    // to associate the Facebook account with a user record in your database,
    // and return that user instead.
    // what do we want to store about user? 
    // displayName
    // id
    // http://passportjs.org/guide/configure/
    // note we modify the example outlined under Strategies to work with
    // the Bookshelf syntax

    // new User({
    //   fb_id:profile.id,
    //   username: profile.displayName
    //   })
    //   .fetch() 
    //   .then(function(newUser){  
    //     if(!user){ 
    //       return done(null, false, {message: 'Incorrect login'})
    //     }
    //     newUser.save()
    //       .then(function(newUser){
    //          Users.add(newUser);
    //          return done(null, newUser);
    //       })
    //       .catch(function(error){
    //         return done(error);
    //       })
    //
 
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