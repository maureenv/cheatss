var express = require("express");
var hbs     = require("express-handlebars");
var app     = express();

app.use("/public", express.static("public")) // the "/public" part can say anything, but "public" must say public.

app.set("view engine", "hbs"); //every express app needs a view engine
app.engine(".hbs", hbs({
  extname: ".hbs", // find files that end in .hbs in views/ folder
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}))

app.get("/", function(req, res){
  res.render("welcome"); //render this in layout-main body tag
});

app.get("/tutorials", function(req, res){
  res.render("tutorials.hbs", {
    tutorials: [
      {
        title: "Flex box"
      },
      {
        title: "Gradients"
      }
    ]
  });
});
// everysingle app.get needs a res.something or else the page will continuosly search for a response.

// params are associated with requests

//nodemon detects when I save a file and refreshes the page for me

app.listen(3001, function(){
  console.log("It's alive");
})
