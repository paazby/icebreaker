var API_KEY = require('../lib/internal-files').API_KEY;
var JWT_SECRET = require('../lib/internal-files').JWT_SECRET;
var FAKE_FB_TOKEN = require('../lib/internal-files').FAKE_FB_TOKEN;
var jwt = require('jwt-simple');

exports.makeRequest = function(message){ 
    var request = require('request');
    var url = require('url');
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

    var options = { 
      protocol: 'http',
      host:'zavadil7.cloudapp.net', 
      pathname: '/matches',
      search: keyAndToken,
      method:'GET'
    };

    var testUrl = url.format(options);
    console.log('testUrl', testUrl);    

    var request = request(testUrl, function(response){ 
      console.log(response.statusCode);
      response.on('data', function(data){ 
        console.log('data', data); 
      }); 
    }); 

    request.on('error', function(e){
      console.log('error', e);
    });
    request.write(message); 
    request.end();
};

exports.makeRequest('_notUsed');
