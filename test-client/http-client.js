var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_TOKEN = require('../lib/internal-files').FAKE_FB_TOKEN;
var jwt = require('jwt-simple');

exports.makeRequest = function(message){ 
    var request = require('request');
    var url = require('url');
    var qs = require('querystring');

    var fbWebToken = jwt.encode({
      fbToken: FAKE_FB_TOKEN
      }, JWT_SECRET);
    
    var apiWebToken = jwt.encode({
      apiKey: API_KEY 
    }, JWT_SECRET);

    var keyAndToken = qs.stringify({
      apiKey: apiWebToken,
      token: fbWebToken
    });

    var options = { 
      protocol: 'http',
      host:'138.91.244.46:4568', 
      pathname: '/matches',
      search: keyAndToken,
      method:'GET'
    };

    var testUrl = url.format(options);
    request(testUrl, function(error, response, body){ 
      
      console.log(response.statusCode);
      response.on('data', function(data){ 
        console.log('data', data); 
      }); 
      response.on('end', function(){
        // more code here
      })
    }); 

  
};

exports.makeRequest('_notUsed');