var express = require('express');
var app = express();

var cors = require('cors');
app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(cors());
  app.use(express.bodyParser());
  app.use(express.session({secret: 'keyboard cat'}));
});

app.options('*', cors());

app.get('/matches',  function(req,res){
  console.log('triggered');
  res.status(200).sendfile(__dirname + '/mockData/test.txt');
});


app.get('/events', function(req, res){
  res.status(200).sendfile(__dirname + '/mockData/test.txt');
}); 
  
//   // fs.readFile('pathToFile', function(err, content){
//   //   manipulate content to json
//   //   stringify
//   //   then send? 

//   // })



var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server now listening on port ' + port);