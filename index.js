var express = require("express");
var hbs     = require("express-handlebars");
var app     = express();
var db      =require("./db/connection");

app.use("/public", express.static("public")) // the "/public" part can say anything, but "public" must say public.

app.set("view engine", "hbs"); //every express app needs a view engine
app.set("port", process.env.PORT || 3001); // needed for HEROKU
app.engine(".hbs", hbs({
  extname: ".hbs", // find files that end in .hbs in views/ folder
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}))

app.get("/", function(req, res){
  res.render("welcome", {
      tutorials: db.tutorials
  }); //render this in layout-main body tag
});
// everysingle app.get needs a res.something or else the page will continuosly search for a response.

app.get("/:title", function(req, res){
  var desiredTutorial = req.params.title;
  var tutorialOut;
  console.log(res.locals);
  db.tutorials.forEach(function(tutorial){
    if(tutorial.title == desiredTutorial){
      tutorialOut = tutorial;
    }
  })
  res.render("tutorials-show", {
    tutorials: db.tutorials,
    tutorial: tutorialOut
  });
});


app.listen(3001, function(){
  console.log("It's alive");
})
