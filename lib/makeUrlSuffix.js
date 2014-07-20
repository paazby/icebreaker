var jwt = require('jwt-simple');
var querystring = require('querystring');
var JWT_SECRET = require('./internal-files').JWT_SECRET;
var API_KEY = require('./internal-files').API_KEY;
/**
 * @param {request}: an instance of node http.IncomingMessage. At this point the
 *                   request has the user profile from the database attached as
 *                   request.user
 *                   http://nodejs.org/api/http.html#http_http_incomingmessage
 * returns           a querystring in the format
 *                   http://www.example.com/?crcat=test&crsource=test&crkw=buy-a-lot
 */

exports.makeUrlSuffix = function(request){
  var fb_id = request.user.attributes.fb_id;
  
  var apiPayload = {
    apiKey: API_KEY
  };
  
  var userPayload = {
    fb_id: fb_id
  };

  var apiKey = jwt.encode(apiPayload, JWT_SECRET);  
  var token = jwt.encode(userPayload, JWT_SECRET);

  var suffix = querystring.stringify({apiToken:apiKey, token:token});
  return '?' + suffix;
};
