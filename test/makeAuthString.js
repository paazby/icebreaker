var makeAuthObject = require('./makeAuthObject');
var querystring = require('querystring');

exports.makeAuthString = function(fbId){
  return '?' + querystring.stringify(makeAuthObject.makeAuthObject(fbId));
};


