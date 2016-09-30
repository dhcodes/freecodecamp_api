// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
})

app.get('/:string', function(req, res) {
 var string = req.params.string;
 if (!isNaN(Number(string)) && Number(string)<=2147472000) {
   string = Number(string)
   var date = new Date(string*1000);
   res.send({
     "unixtime": string,
     "date": date
   });
 }
 
 else if (isNaN(Number(string)) && !isNaN(Date.parse(string))) {
   var time = Date.parse(string) 
   date = new Date(time);
   
   res.send({
     "unixtime": time,
     "date": date
   })
   
 }
 
 else {
   res.status(500).send("<h1>Server Error 500</h1> URL parameters did not meet guidelines")
 }
 
 
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});