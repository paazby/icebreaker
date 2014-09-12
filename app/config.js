var Bookshelf = require('bookshelf');
var path = require('path');

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: process.env.IP || '127.0.0.1',
    user: 'your_database_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'icedb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/ice.sqlite')
  }
});

// our database schema will consist of three columns: user_0_id, user_1_id,
// and count. When we store a match we will always sort the ids and put
// the smaller id in the user_0_id field and te larger id in the 
// user_1_id field. This allows us to easily check for a new match 
// by sorting and then querying using the ordered ids

db.knex.schema.hasTable('matches').then(function(exists){
  if(!exists){
    db.knex.schema.createTable('matches', function(match){
      match.increments('id').primary();
      match.string('initiator_id', 255);
      match.string('target_id', 255);
      match.boolean('matched');
      match.timestamps();
    }).then(function(table){
      console.log('Created Table', table);
    });
  }
});



// http://knexjs.org/#Schema-createTable
// go to createTable, chainable methods
// Type of user id is string. Specified at
// https://developers.facebook.com/docs/graph-api/reference/v2.0/user
// TODO: matches and events
// TODO: pictures

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.string('fb_id', 100).primary();
      user.string('access_token', 255);
      user.string('username', 100).unique();
      user.string('description', 143);
      user.boolean('is_male');
      user.integer('age');
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
