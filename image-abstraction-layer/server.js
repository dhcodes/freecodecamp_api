// server.js
// where your node app starts

// init project
var express = require('express');
var Bing = require('node-bing-api')({ accKey: process.env.BING });
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.



// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "title":"image search abstraction api",
      "instructions":"add a search query after the '/' in the URL of the address bar. Special characters may not work.",
      "results":"image results will be output as JSON objects. Add '?offset=#' where # is a number to get a different page of query results.",
      "coded_by":"dhcodes"
    })
  } catch (err) {
    handleError(err, res);
  }
});

app.get("/:string/:offset?", function (req, res) {
  try {
    var page = req.query.offset;
    console.log(page);
    var query = req.params.string;
    var results = [];
    var skipamount = 0;
    
    if (page) {
      skipamount = 10 * (page-1);
    }
    
    
    Bing.images(query, {top: 10, skip: skipamount, market: 'en-US', adult: 'Strict'}, function(error, response, body) {
    
    for (var i = 0; i<body.d.results.length; i++) {
      var total;
      var obj = {};
      obj.url = body.d.results[i].MediaUrl;
      obj.snippet = body.d.results[i].Title;
      obj.thumbnail = body.d.results[i].Thumbnail.MediaUrl;
      obj.context = body.d.results[i].SourceUrl;
      results.push(obj)
      }
      
      res.send(results);
      
    });
      console.log(results)
      } catch (err) {
    handleError(err, res);
  }
  
});

/*
app.get("/*", function (req, res) {
  try {
    res.status(500);
    response.send(
      "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
  }
 catch (err) {
    handleError(err, res);
  }
});
*/

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}