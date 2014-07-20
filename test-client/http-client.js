var request = require('request');
var url = require('url');
var qs = require('querystring');

var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_ID = require('../lib/internal-files').FAKE_FB_ID;
var jwt = require('jwt-simple');


var makeAuthenticationString = function(){
  var jwtWebToken = jwt.encode({
    fb_id: FAKE_FB_ID
    }, JWT_SECRET);
    
  var apiWebToken = jwt.encode({
    apiKey: API_KEY 
    }, JWT_SECRET);

  var keyAndToken = qs.stringify({
    apiKey: apiWebToken,
    token: jwtWebToken
  });
  
  return keyAndToken;
};

var makeAuthenticationObject = function(){
  var jwtWebToken = jwt.encode({
    fb_id: FAKE_FB_ID
    }, JWT_SECRET);
    
  var apiWebToken = jwt.encode({
    apiKey: API_KEY 
    }, JWT_SECRET);

  var authenticationObject = {
    apiKey: apiWebToken,
    token: jwtWebToken
  };
  
  return authenticationObject;
};

var makeRequest = function(path){ 
  
    var options = { 
      protocol: 'http',
      host: process.env.CURRENT_HOST, 
      pathname: path,
      query: makeAuthenticationObject(),
      method:'GET'
    };

    var testUrl = url.format(options);
    console.log('testUrl', testUrl);    

    request(testUrl, function(error, response, body){ 
      if(!error && response.statusCode === 200){
        console.log(body);
      } else {
        console.log('Error:', error);
      }
    });
};


var runHttpClient = function(){
  var path = process.argv[2] || '/matches';
  makeRequest(path);
};

runHttpClient();
