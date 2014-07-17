var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = require('./internal-files').FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = require('./internal-files').FACEBOOK_APP_SECRET;
var User = require('../app/models/user');
var Users = require('../app/collections/users');

// Once authentication succeeds, a session will be established and maintained
// via a cookie set in the user's browser.
// Subsequent requests do not contain credentials but rather the unique
// cookie that identifies the session. Passport will serialize and 
// deserialize user instances to and from the session
// Only the user ID is serialize to the session. When subsequent requests 
// are received the ID is used to find the user, which will be restored
// to req.user



passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://zavadil7.cloudapp.net/linden/passman/dustytoken"
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
   

    new User({fb_id:profile.id, username: profile.displayName})
      .fetch()  // trigger an error if the fetched model is not found 
      .then(function(user){
        if(!user){  // case where we have a new user
          var newUser = new User({
            fb_id: profile.id,
            username: profile.displayName
          });
          console.log('newUser', newUser);
          newUser.save()
            .then(function(newUser){
              console.log("newUser save");
              Users.add(newUser);
              return done(null, newUser);
            });
        } else {
            new User({fb_id:profile.id, username: profile.displayName})
            .fetch()
            .then(function(user){
              return done(null, user)
            });
        }
      })
      .catch(function(error){
        return done(error);
      })
  }
));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

module.exports.passport = passport;
