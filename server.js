var app = require('./server-config.js').app;
var http = require('./server-config.js').http;

var port = process.env.PORT || 80;

http.listen(port,function(){
  console.log('Server now listening on port ' + port);  
});


