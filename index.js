var express = require("express");
var parser  = require("body-parser");
var hbs     = require("express-handlebars");
var app     = express();
var mongoose =require("./db/connection"); //connection to database
var Tutorial = mongoose.model("Tutorial");

app.use("/public", express.static("public")) // the "/public" part can say anything its what shows up in URL, but "public" must say public.
app.use(parser.urlencoded({extended: true})); //makes body parser support html forms

app.set("view engine", "hbs"); //every express app needs a view engine
app.set("port", process.env.PORT || 3001); // needed for HEROKU PORT || 3001
app.engine(".hbs", hbs({
  extname: ".hbs", // find files that end in .hbs in views/ folder
  partialsDir: "views/",
  layoutsDir: "views/",
  defaultLayout: "layout-main"
}))

// everysingle app.get needs a res.something or else the page will continuosly search for a response.

app.get("/", function(req, res){
  Tutorial.find().sort({title:1}).then(function(tutorials){
    // if(err){
    //   console.log("welcome page error ", err, tutorials);
    // }
    res.render("welcome", {
      tutorials: tutorials // to render tutorials in nav bar
    })
  }) //render this in layout-main body tag
});



app.get("/form", function(req, res){
  // res.render("welcome", {
  //     tutorials: db.tutorials
  Tutorial.find().sort({title:1}).then(function(tutorials){
    res.render("form", {
      tutorials: tutorials // to render tutorials in nav bar
    })
  }) //render this in layout-main body tag
});


app.get("/edit-form/:title", function(req, res){
  Tutorial.findOne({title: req.params.title}).then(function(tutorial){
    Tutorial.find().sort({title:1}).then(function(tutorials){
      res.render("edit-form", {
        tutorial: tutorial,
        tutorials: tutorials // render all tutorials in nav bar
      })
    })
  });
});

app.get("/:title", function(req, res){
  Tutorial.findOne({title: req.params.title}).then(function(tutorial){
    Tutorial.find().sort({title:1}).then(function(tutorials){ // to render tutorials in nav bar
      res.render("tutorials-show", {
        tutorial: tutorial,
        tutorials: tutorials // to render tutorials in nav bar
      })
    })
  });
});

// DELETE post
app.post("/:title/delete", function(req, res){
  Tutorial.findOneAndRemove({title: req.params.title}).then(function(){
    res.redirect("/")
  });
});

// Create post
app.post("/tutorials-show", function(req, res){
  //res.json(req.body); //The server will respond with JSON that contains the user input, which is stored in req.body. res.json(req.body) is the initial test to see if json data is rendered.
  req.body.tutorial.title = req.body.tutorial.title.trim();
  Tutorial.create(req.body.tutorial).then(function(tutorial){
    res.redirect("/" + tutorial.title);
  });
});

// edit post
app.post("/edit-form/:title", function(req, res){
  console.log("update", req.body);
  Tutorial.findOneAndUpdate({title: req.params.title}, req.body.tutorial, {new: true}).then(function(tutorial){ //req.body.tutorial is the object of all my tutorial attributes
    // if (err){
    //   console.log("error updating", err, tutorial)
    // }
    res.redirect("/" + tutorial.title );

  });
});

 
app.listen(app.get("port"), function(){
  console.log("I work on localhost:3001");
});
