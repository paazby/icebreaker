var db = require('../config');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  idAttribute: fb_id
});

module.exports = User;
