var request = require('request');
var url = require('url');
var qs = require('querystring');

var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_ID = require('../lib/internal-files').FAKE_FB_ID;
var jwt = require('jwt-simple');


var makeAuthenticationString = function(){
  var jwtWebToken = jwt.encode({
    fb_id: 3
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

var addQuery = function(queryObject, targetId){
  if(targetId){
    queryObject.target_id = targetId;
    return queryObject;
  }
  return queryObject;
}

var makeGetRequest = function(path){ 
    
    var host = process.env.CURRENT_HOST || 'dev-ice.cloudapp.net';


    var options = { 
      protocol: 'http',
      host: host, 
      pathname: path,
      query: addQuery(makeAuthenticationObject(),1)
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


var makePostRequest = function(path){ 
    
    var host = process.env.CURRENT_HOST || 'dev-ice.cloudapp.net';
    var augmentedQuery = addQuery(makeAuthenticationObject(), 1);
    console.log('aq', augmentedQuery);

    var options = { 
      protocol: 'http',
      host: host, 
      pathname: path,
      query: augmentedQuery
    };

    var testUrl = url.format(options);
    console.log('testUrl', testUrl);    

    request.post(testUrl, function(error, response, body){ 
      if(!error && response.statusCode === 200){
        console.log(body);
      } else {
        console.log('Error:', error);
      }
    });
};



var runHttpClient = function(){
  var path = process.argv[2] || '/matches';
  var httpType = process.argv[3] || 'g';
  if( httpType === 'g'){
    makeGetRequest(path);
  } else if( httpType === 'p'){
    makePostRequest(path);
  }
};

//runHttpClient();
exports.makeAuthenticationString = makeAuthenticationString;