var querystring = require('querystring');
var jwt = require('jwt-simple');

var API_KEY = require('../lib/internal-files').API_KEY;                                                                       var JWT_SECRET = require('../lib/internal-files').JWT_SECRET; 

exports.makeApiKey = function(){
      
  var apiWebToken = jwt.encode({
    apiKey: API_KEY 
    }, JWT_SECRET);

  var authenticationObject = {
    apiKey: apiWebToken,
  };

  return '?' + querystring.stringify(authenticationObject);  
};
