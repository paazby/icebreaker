var jwt = require('jwt-simple');
var querystring = require('querystring');
var JWT_SECRET = require('./internal-files').JWT_SECRET;

/**
 * @param {request}: an instance of node http.IncomingMessage. At this point the
 *                   request has the user profile from the database attached as
 *                   request.user
 *                   http://nodejs.org/api/http.html#http_http_incomingmessage
 * returns           a querystring in the format
 *                   http://www.example.com/?crcat=test&crsource=test&crkw=buy-a-lot
 */

exports.makeUrlSuffix = function(request){
  var fb_id = request.user.fb_id;
  var payload = {
    fb_id: fb_id
  };
  var token = jwt.encode(payload, JWT_SECRET);
  var suffix = querystring.stringify({token:token});
  return '?' + suffix;
};
