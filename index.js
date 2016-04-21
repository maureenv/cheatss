var express = require("express");
var hbs     = require("express-handlebars");
var app     = express();
var mongoose =require("./db/connection"); //connection to database
var Tutorial = mongoose.model("Tutorial");

app.use("/public", express.static("public")) // the "/public" part can say anything its what shows up in URL, but "public" must say public.

app.set("view engine", "hbs"); //every express app needs a view engine
app.set("port", process.env.PORT || 3001); // needed for HEROKU
app.engine(".hbs", hbs({
  extname: ".hbs", // find files that end in .hbs in views/ folder
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}))

app.get("/", function(req, res){
  // res.render("welcome", {
  //     tutorials: db.tutorials
  Tutorial.find({}).then(function(tutorials){
    res.render("welcome", {
      tutorials: tutorials // to render tutorials in nav bar
    })
  }) //render this in layout-main body tag
});
// everysingle app.get needs a res.something or else the page will continuosly search for a response.

app.get("/:title", function(req, res){
  // CODE FROM WHEN DATABASE WASN'T ACTIVE YET
  // var desiredTutorial = req.params.title;
  // var tutorialOut;
  // db.tutorials.forEach(function(tutorial){
  //   if(tutorial.title == desiredTutorial){
  //     tutorialOut = tutorial;
  //   }
  // })
  // res.render("tutorials-show", {
  //   tutorials: db.tutorials,
  //   tutorial: tutorialOut
  // });

  Tutorial.findOne({title: req.params.title}).then(function(tutorial){
    Tutorial.find({}).then(function(tutorials){ // to render tutorials in nav bar
      res.render("tutorials-show", {
        tutorial: tutorial,
        tutorials: tutorials // to render tutorials in nav bar
      })
    })
  });
});

app.listen(app.get("port"), function(){
  console.log("I work on localhost:3001");
});
