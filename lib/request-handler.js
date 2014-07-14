var request = require('request');
var util = require('../lib/utility');

var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var db = require('../app/config');
var User = require('../app/models/user');
var Match = require('../app/models/match');
var Users = require('../app/collections/users');
var Matches = require('../app/collections/matches');
var url = require('url');
var API_KEY = require('./internal-files').API_KEY;



exports.renderIndex = function(req, res) {
  //TODO: 
  console.log('render index', req.session);
  res.status(200).sendfile(process.cwd() + '/public/static/index.html');
  //res.render('index');
};

exports.serverMatches = function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  if(query.apiKey !== )
  var target_id = query.target_id;
}

exports.postMatches = function(req, res) {
  // query the database to see if the current user matches either user_0
  // or user_1 field of our database. If the we get a result back then 
  // we know that we have a match. We can check the count and if the 
  // update the count. If the count is already 2 then something has
  // gone wrong.
 
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var target_id = query.target_id;
  var match = new Match()
    .query({where: {user_0_id: '1'}, 
         orWhere: {user_1_id: '10'},
         andWhere:{count: 2}})
    .fetch()
    .then(function(model){
      if(!model){
        res.writeHead(204)
        res.end('No matches');
      } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        model = JSON.stringify(model);
        res.end(model);
      }
      console.log('query: ', model);
    })
    .catch(function(err){
      console.log('Error(postMatches: ', err);
    });
}




exports.serveMatches = function(req, res) {
  // we need to search the matches database for all matches where 
  // the current user equals the user_0_id or the current user id 
  // equals the user_1_id and count equals 2

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var target_id = query.target_id;


  
  new Match({ user_0_id: '1' }).fetch().then(function(found) {
    if (found) {
      if(found.count === 1){
        found.set({
          count:2
        });
      } else if(found.count ===2 ) {
        console.log('Error: ')
      }
    } else { //not found cas
      var url_parts = url.parse(req.url, true);
      var query = url_parts.query;
      var match = new Match({
        user_id_0: '1',
        user_id_1: query.target_id,
        count: 1
      });

      match.save().then(function(newMatch) {
        Matches.add(newMatch);
        res.send(200, newMatch);
      });
    });
    }
  });
};

};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  console.log('logout!!');
  req.logout();
  res.redirect('/auth/facebook');
};


exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username
        });
        newUser.save()
          .then(function(newUser) {   //TODO: set userId, not user object
            util.createSession(req, res, newUser);
            Users.add(newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
};

