var argv = require('optimist').argv;


var makeAuthObject = require('./makeAuthObject');
var FAKE_FB_ID = require('../lib/internal-files').FAKE_FB_ID;

var test = function(){
  console.log(FAKE_FB_ID);
  console.log(makeAuthObject.makeAuthObject(FAKE_FB_ID));
};


