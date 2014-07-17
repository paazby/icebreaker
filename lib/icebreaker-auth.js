var url = require('url');
var User = require('../app/models/user');
var Users = require('../app/collections/users');
var API_KEY = require('./internal-files').API_KEY;
var JWT_SECRET = require('./internal-files').JWT_SECRET;
var serverUtil = require('../lib/server-utils');
var jwt = require('jwt-simple');

// check whether the api_key on the url matches the 
// icebreaker API_KEY
// check whether the token is a valid token. if it is then
// the attach the user id to the request.


exports.iceAuthenticated = function(request, response, next){
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;

  if(query.apiKey !== API_KEY){
    serverUtil.send404(request, response);
    return;
  } 

  var token = query.accessToken;
  // decode the token and then query the database to find
  // the user. if the user is not found, 404 the request
  // if the user is found, attach the users fb_id to the
  // request and call next
  currentToken = jwt.decode(token, JWT_SECRET);

  new User()
    .query({where: {fb_token: currentToken}})
      .fetch()
      .then(function(user){
        if(!user){
          serverUtil.send404(request, response);
        } else {
          request.mydata = {};
          request.mydata.user = user;
          return next();
        }
      })
      .catch(function(err){
        serverUtil.send404(request, response);
        console.log(err);
      });
 };