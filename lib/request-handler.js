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
  Matches
    .query({where: {initiator_id: user.attributes.fb_id}, 
      orWhere: {target_id: user.attributes.fb_id},
      andWhere:{matched: true}})
      .fetch()
      .then(function(matches){
        if(!matches){
          serverUtil.sendResponse(res, 'No matches', 204);
        } else {
          serverUtil.sendResponse(res, matches, 200);
        }
      })
      .catch(function(err){
        console.log('Error(postMatches): ', err);
      });
};

exports.postMatches = function(request, response) {
  // query the database to see if the current user matches either user_0
  // or user_1 field of our database. If the we get a result back then 
  // we know that we have a match. We can check the count and if the 
  // update the count. If the count is already 2 then something has
  // gone wrong.
  // where am I going to get the current user id? 
  //  
  // TODO: we may have to look up the targets facebook id

  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  var initiatorId = request.mydata.user.attributes.fb_id;
  var targetId = query.target_id;

  Users
    .query('where', 'fb_id', query.target_id)
    .fetch()
    .then(function(users){
      if(users.length === 0){
        serverUtil.sendResponse(response,'id doesnt exist',403);
        return;
      } else {
        
        new Match()
          .query({where:{initiator_id:targetId}, 
      	     andWhere:{target_id: initiatorId}})
            .fetch()
            .then(function(found) {
              // if the match was found, then we now have a match 
              if(found) {
                console.log('found', found);
                if(!found.attributes.matched){
                  found.set({
                    matched:true
          	  });

                  found.save()
                  .then(function(update){
                    serverUtil.sendResponse(response, update, 200);
                  })
                  .catch(function(err){
                    serverUtil.sendResponse(response, 'Error', 403);
              	    console.log('err', err);
                  });
                } else if( found.attributes.matched ) {
          	  serverUtil.sendResponse(response, 'Error: already matched', 403);
                }
              } else { //not found case
                new Match()
                  .query({where:{initiator_id:initiatorId},
                  andWhere:{target_id: targetId}})
                  .fetch()
                  .then(function(found){
                    if(!found){  
                      var match = new Match({
                        initiator_id:initiatorId,
              	        target_id: targetId,
              	        matched: false
          	      });

          	      match.save()
                      .then(function(newMatch) {
                        Matches.add(newMatch);
                        serverUtil.sendResponse(response, newMatch,200);
          	      });
                    } else {
                      serverUtil.sendResponse(response, 'Error: already exists', 403);
                    }
                  });
              }
          });
      }
    }); 
};


// serveCandidates returns all users of the opposite gender
// the icebreaker authentication middleware retrieves the
// user from the database and attaches the user to the 
// request namespaces under mydata
// 

exports.serveCandidates = function(request, response){
  // code here
  var user = request.mydata.user;

  // if the user is male we return female candidates and vice versa
  var oppositeGender = user.attributes.is_male ? 0 : 1;
  Users
    .query('where','is_male',oppositeGender)
    .fetch()
    .then(function(candidates){
      if(!candidates){
        serverUtil.sendResponse(response, 'No matches', 204);
      } else {
        serverUtil.sendResponse(response, candidates, 200);
      }
    })
    .catch(function(err){
      serverUtil.send404(request, response);
      console.log(err);
    });
};
