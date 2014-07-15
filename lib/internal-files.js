var fs = require("fs");

var LOCAL_FACEBOOK_APP_ID;
var LOCAL_FACEBOOK_APP_SECRET;
var LOCAL_API_KEY;
var LOCAL_JWT_SECRET;

var content = fs.readFileSync("/Users/azavadil/Documents/fbsecret/app_id.txt",'utf8');

if(!content){
  console.log("failed to read appId file");
} else {
  var array = content.split("\n");
  LOCAL_FACEBOOK_APP_ID = array[0].trim();
  LOCAL_FACEBOOK_APP_SECRET = array[1].trim();
  LOCAL_API_KEY = array[2].trim();
  LOCAL_JWT_SECRET = array[3].trim();
}

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || LOCAL_FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || LOCAL_FACEBOOK_APP_SECRET;
var API_KEY = process.env.API_KEY || LOCAL_API_KEY;
var JWT_SECRET = process.env.JWT_SECRET || LOCAL_JWT_SECRET;

module.exports.FACEBOOK_APP_ID = FACEBOOK_APP_ID;
module.exports.FACEBOOK_APP_SECRET = LOCAL_FACEBOOK_APP_SECRET;
module.exports.API_KEY = API_KEY;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.FAKE_FB_TOKEN = 'fuwnacwgca'
