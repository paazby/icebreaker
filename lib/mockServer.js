var express = require('express');
var app = express();

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.bodyParser());
  app.use(express.session({secret: 'keyboard cat'}));
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.

app.get('/events',  function(req,res){
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.sendFile('path/to/file');
});
app.get('/matches', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.sendFile('path/to/file');

  /*
  fs.readFile('pathToFile', function(err, content){
    manipulate content to json
    stringify
    then send? 

  })
});



var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);