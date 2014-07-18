var request = require('request');
var util = require('../lib/utility');
var serverUtil = require('../lib/server-utils');

var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;

var db = require('../app/config');
var User = require('../app/models/user');
var Match = require('../app/models/match');
var Users = require('../app/collections/users');
var Matches = require('../app/collections/matches');
var url = require('url');



exports.renderIndex = function(req, res) {
  console.log('render index triggered');
  res.status(200).sendfile(process.cwd() + '/public/static/index.html');
};

// we need to search the matches table for all matches where 
// the current user equals the user_0_id or the current user id 
// equals the user_1_id and count equals 2
exports.serveMatches = function(req, res){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var user = req.mydata.user;

  // check that the request provided a valid api key
  console.log('server matches triggered'); 
  var match = new Match()
    .query({where: {user_0_id: user.fb_id}, 
      orWhere: {user_1_id: user.fb_id},
      andWhere:{count: 2}})
      .fetch()
      .then(function(model){
        if(!model){
          serverUtil.sendResponse(res, 'No matches', 204);
        } else {
          serverUtil.sendResponse(res, model, 200);
        }
      })
      .catch(function(err){
        console.log('Error(postMatches): ', err);
      });
};

exports.postMatches = function(req, res) {
  // query the database to see if the current user matches either user_0
  // or user_1 field of our database. If the we get a result back then 
  // we know that we have a match. We can check the count and if the 
  // update the count. If the count is already 2 then something has
  // gone wrong.
  // where am I going to get the current user id? 
  //  
  // TODO: we may have to look up the targets facebook id
  console.log('post matches triggered');

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  // Sort the ids so that we always know when we query that if there
  // is a match the smaller id is always in user_0_id and the larger
  // id is in user_1_id
  var alreadyInOrder = req.mydata.user.fb_id < query.target_id;
  var low_id = alreadyInOrder ? req.mydata.user.fb_id : query.target_id;
  var high_id = alreadyInOrder ? query.high_id : req.mydata.user.fb_id;

  
  new Match()
    .query({where:{user_0_id:low_id}, 
      andWhere:{user_1_id: high_id}})
     .fetch()
     .then(function(found) {
      if (found) {
        if(found.attributes.count === 1){
        found.set({
            count:2
          });

          found.save()
          .then(function(update){
            console.log('updated', update);
          })
          .catch(function(err){
            console.log('err', err);
          })
        } else if(found.attributes.count === 2 ) {
          console.log('Error: count already 2, increment attempted');
        }
      } else { //not found case
      
        var match = new Match({
          user_0_id: low_id,
          user_1_id: high_id,
          count: 1
        });

      match.save().then(function(newMatch) {
        Matches.add(newMatch);
        res.send(200, newMatch);
      });
    }
  });
};

