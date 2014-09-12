var jwt = require('jwt-simple');

var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;


var makeAuthenticationObject = function(facebookId){
 
  var apiWebToken = jwt.encode({
    apiKey: API_KEY 
    }, JWT_SECRET);

  var jwtWebToken = jwt.encode({
    fb_id: facebookId
    }, JWT_SECRET);

  var authenticationObject = {
    apiKey: apiWebToken,
    token: jwtWebToken
  };
  
  return authenticationObject;
};

exports.makeAuthObject = makeAuthenticationObject;
