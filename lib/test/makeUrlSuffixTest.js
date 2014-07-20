var suffix = require('../makeUrlSuffix');
var JWT_SECRET = require('../internal-files').JWT_SECRET;
var jwt = require('jwt-simple');
var qs = require('querystring');
var url = require('url');
var assert = require('../../test/assert');



var makeRandom = function(){
  var alpha = 'abcdefghijklmnopqrstuvwxyz';
  var results = [];
  var randomIndex;
  for(var i = 0; i < 10; i++){
    randomIndex = Math.round(Math.random()*alpha.length);  
    results.push(alpha.charAt(randomIndex));
  }
  return results.join('');
};

var test = function(){
  var fakeFbId = makeRandom();
  
  var request = {};
  request.user = {};
  request.user.fb_id = fakeFbId;
  var result = suffix.makeUrlSuffix(request);

  var queryString = qs.parse(result.substring(1)) // cut off the ?
  var decodedToken = jwt.decode(queryString.token, JWT_SECRET);
  assert.assert(decodedToken.fb_id === fakeFbId, "decoded token didn't match");
 
};

test();
