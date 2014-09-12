var serverUtil = require('../lib/server-utils');

exports.serveUser = function(request, response){
  // code here
  var user = request.mydata.user;
  var responseObject = {
    username: user.attributes.username,
    description: user.attributes.description,
    age: user.attributes.age,
    is_male: user.attributes.is_male,
    fb_id: user.attributes.fb_id
  };
  console.log(user);

  serverUtil.sendResponse(response, responseObject, 200);
}; 
