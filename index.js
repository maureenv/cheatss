var express = require("express");
var app     = express();

app.get("/", function(req, res){
  res.send("hello");
});
// everysingle app.get needs a res.something or else the page will continuosly search for a response.

// params are associated with requests

//nodemon detects when I save a file and refreshes the page for me

app.listen(3001, function(){
  console.log("It's alive");
})
