var express = require('express');
var partials = require('express-partials');
var util = require('./lib/utility');
var passport = require('./lib/auth').passport;
var iceAuthenticated = require('./lib/icebreaker-auth').iceAuthenticated;
var serverUtil = require ('./lib/server-utils.js');
var jwt = require('jwt-simple');
var JWT_SECRET = require('./lib/internal-files').JWT_SECRET;

var handler = require('./lib/request-handler');

var app = express();

app.configure(function() {
  app.use(partials());
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(passport.initialize());
});


// Passport session setup.

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});

// https://github.com/jaredhanson/passport-http-bearer ({session:false}) example
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
  function(req, res) {
    var urlSuffix = makeUrlSuffix(req);
    res.redirect('/linden/passman/dustytoken/'+urlSuffix);
  });


app.get('/',  handler.renderIndex);
app.get('/matches', iceAuthenticated, handler.serveMatches);
app.post('/matches', iceAuthenticated, handler.postMatches);


app.get('/logout', handler.logoutUser);

app.get('/signup', handler.signupUserForm);
app.post('/signup', handler.signupUser);

app.get('/*', serverUtil.send404);



module.exports = app;
