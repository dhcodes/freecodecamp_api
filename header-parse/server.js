// server.js
// where your node app starts

// init project
var http = require('http');


var server = http.createServer();
server.on('request', (request, response) => {
  response.writeHead(200);
  
  var ua = request.headers['user-agent'];
  var os = ua.match(/\(.+\d\)/)[0].slice(1,-1);
  var ip = request.headers['x-forwarded-for'].match(/\d+.\d+.\d+.\d+/)[0];
  var lang = request.headers['accept-language'].match(/\w+-?\w+/)[0];
  var user = JSON.stringify({
    "ipaddress": ip,
    "language": lang,
    "software": os
  })
  

  response.end(user)
});

var listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});