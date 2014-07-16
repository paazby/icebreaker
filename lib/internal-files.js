var fs = require("fs");
var path = require('path');

var LOCAL_FACEBOOK_APP_ID;
var LOCAL_FACEBOOK_APP_SECRET;
var LOCAL_API_KEY;
var LOCAL_JWT_SECRET;

var FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET;
var API_KEY;
var JWT_SECRET;

var filename_local = "/Users/azavadil/Documents/fbsecret/app_id.txt";
var filename_production  = "/home/azureuser/fbsecret/app_id.txt";



if( fs.existsSync(filename_local) ){
  var content = fs.readFileSync("/Users/azavadil/Documents/fbsecret/app_id.txt",'utf8');
  var array = content.split("\n");
  LOCAL_FACEBOOK_APP_ID = array[0].trim();
  LOCAL_FACEBOOK_APP_SECRET = array[1].trim();
  LOCAL_API_KEY = array[2].trim();
  LOCAL_JWT_SECRET = array[3].trim();
}

if( fs.existsSync(filename_production) ){
  var content = fs.readFileSync(filename_production,'utf8');
  var array = content.split("\n");
  LOCAL_FACEBOOK_APP_ID = array[0].trim();
  LOCAL_FACEBOOK_APP_SECRET = array[1].trim();
  LOCAL_API_KEY = array[2].trim();
  LOCAL_JWT_SECRET = array[3].trim();
}



FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || LOCAL_FACEBOOK_APP_ID;
FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || LOCAL_FACEBOOK_APP_SECRET;
API_KEY = process.env.API_KEY || LOCAL_API_KEY;
JWT_SECRET = process.env.JWT_SECRET || LOCAL_JWT_SECRET;
 
module.exports.FACEBOOK_APP_ID = FACEBOOK_APP_ID;
module.exports.FACEBOOK_APP_SECRET = LOCAL_FACEBOOK_APP_SECRET;
module.exports.API_KEY = API_KEY;
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.FAKE_FB_TOKEN = 'fuwnacwgca'
