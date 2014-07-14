var db = require('../config');
var User = require('./user')

// Model is a row in the database
var Match = db.Model.extend({
  tableName: 'matches',
  hasTimestamps: true,
  users: function(){
    return this.belongsToMany(User);
  },
  initialize: function(){
    //any initialize code goes here
  }
});

module.exports = Match;
