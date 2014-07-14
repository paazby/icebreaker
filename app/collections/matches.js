// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var Match = require('../models/match');

var Matches = new db.Collection();

Matches.model = Match;

module.exports = Matches;