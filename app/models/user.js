var db = require('../config');
var Promise = require('bluebird');
var Match = require('./match');

var User = db.Model.extend({
  tableName: 'users',
  matches: function(){
    return this.hasMany(User).through(Match);
  },
  hasTimestamps: true
});


module.exports = User;
