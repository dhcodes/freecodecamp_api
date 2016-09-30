// server.js
// where your node app starts

// init project
var H = require("hyperweb");
var datastore = require("./datastore").sync;
const valid = require('valid-url');
app = H.blastOff();
datastore.initializeApp(app);
var obj;
var href;

//Provide instruction for user visiting site.
app.get("/", function (req, res) {
  try {
//if needed, uncomment to clear links
//initializeDatastoreOnProjectCreation()
  console.log('app initialized')
    var links = datastore.get("links");
    console.log(links)
    res.send(
    {
    "directions": "Please enter a URL after the '/' in the address bar above (ex. 'https://great-brow.hyperdev.space/yoururl')",
    "all_links_available_at": "https://great-brow.hyperdev.space/links",
    "coded_by": "dhcodes"
  });
  
  } catch (err) {
    handleError(err, res);
  }
});

//display list of all links generated.
app.get("/links", function (req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    var links = datastore.get("links");
    console.log(links);
    
    res.send(links);
  } catch (err) {
    handleError(err, res);
  }
});
  

//if statement to determine process when link is fed a string.
app.get("/:string(*)", function (req, res) {
  var string = req.params.string;
  
  //Hyperdev borks the extra '/' in the http:// so we need to add it back in.
  if (/^\w+\.\w+\.\w+\/?(\w+\/?){0,6}$/.test(string)) {
      res.setHeader('Content-Type', 'application/json');
      console.log("right string")
      string = "https://" + string;
      storeURL(string);
      res.send(JSON.stringify(obj));
    }
  
  else if (/https?:\//.test(string)) {
    res.setHeader('Content-Type', 'application/json');
    string = string.substring(0,6) + '/' + string.substring(6)
    storeURL(string);
    res.send(JSON.stringify(obj));
  }
  
  
  //if the string matches the pattern of the id...
  else if (/^\w\w\w\w$/.test(string)) {
    //and it it stored in the link database, redirect to the original url.
    var links = datastore.get("links")
    if (isStoredId(string)) {
      res.redirect(href)
    }
    else {
      res.status(500).send("<h1>Server Error 500</h1> That ID does not exist in the database")
    }
    
    }
       //res.status(500).send("<h1>Server Error 500</h1> That ID does not exist in the database")
  
  
  //otherwise, if the string is not a valid url, return an error.
  else if (!valid.isUri(string)) {
    console.log(valid.isUri(string))
    res.status(500).send("<h1>Server Error 500</h1> URL parameters did not meet guidelines")
  }
  
});
  
  //if it's a valid url and properly formatted, give it a new random id and pass the object to the links collection.
  function storeURL(string) {
    var links = datastore.get("links")
    var id = rando(); 
    obj = {
      "id": id,
      "original_url": string,
      "shortened_url": "https://great-brow.hyperdev.space/"+id
    }
    
    links.push(obj)
    console.log(links)
    datastore.set("links", links);
    
    
    
  }
  
  function isStoredId(string) {
    var links = datastore.get("links")
    for (var i = 0; i<links.length; i++) {
      if (string == links[i].id) {
        href = links[i].original_url;
        return true;
      }
    }
   return false;
  }
  


function rando() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

}



function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}


// ------------------------
// DATASTORE INITIALIZATION

/*
function initializeDatastoreOnProjectCreation() {
  datastore.set("links", links);
  datastore.set("initialized", true);
  
}

var links = [
  {
    "id": "id_1",
    "original_url": "url_1",
    "shortened_url": "short_url1"
  },
  {
    "id": "id_2",
    "original_url": "url_2",
    "shortened_url": "short_url2"
  }
];

*/