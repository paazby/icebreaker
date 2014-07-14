var db = require('../config');
var Promise = require('bluebird');
var Match = require('./match');

var User = db.Model.extend({
  tableName: 'users',
  matches: function(){
    return this.belongsToMany(Match)
  },
  hasTimestamps: true
});


module.exports = User;
