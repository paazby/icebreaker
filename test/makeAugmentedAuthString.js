var makeAuthObject = require('./makeAuthObject');
var querystring = require('querystring');

exports.makeAugmentedAuthString = function(fbId, targetId){
  var authenticationObject = makeAuthObject.makeAuthObject(fbId);
  authenticationObject.target_id = targetId;
  return '?' + querystring.stringify(authenticationObject);
};


