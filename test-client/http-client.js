var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_TOKEN = require('../lib/internal-files').FAKE_FB_TOKEN;
var jwt = require('jwt-simple');

exports.makeRequest = function(message){ 
    var http = require('http');
    var qs = require('querystring');

    var fbWebToken = jwt.encode({
      fb_token: FAKE_FB_TOKEN
      }, JWT_SECRET);
    
    var apiWebToken = jwt.encode({
      api_key: API_KEY 
    }, JWT_SECRET);

    var keyAndToken = qs.stringify({
      api_key: apiWebToken,
      token: fbWebToken
    });
    console.log(keyAndToken);

    var options = { 
      host:'http://138.91.244.46', 
      port:4568, 
      path: '/matches' + keyAndToken, 
      method:'GET'
    };
    // request takes 2 args
    // @param0: options 
    // @param1: a readable stream 
    var request = http.request(options, function(response){ 
      console.log(response.statusCode);
      response.on('data', function(data){ 
        console.log(data); 
      }); 
    }); 
    request.write(message); 
    request.end();
};

exports.makeRequest('_notUsed');