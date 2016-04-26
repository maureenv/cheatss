var express = require("express");
var parser  = require("body-parser");
var validator = require("express-validator");
var hbs     = require("express-handlebars");
var app     = express();
var mongoose =require("./db/connection"); //connection to database
var Tutorial = mongoose.model("Tutorial");
// validation tutorial https://booker.codes/input-validation-in-express-with-express-validator/



app.use("/public", express.static("public")) // the "/public" part can say anything its what shows up in URL, but "public" must say public.
app.use(parser.urlencoded({extended: true})); //makes body parser support html forms
app.use(validator());

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
app.post("/form", function(req, res){
  //res.json(req.body); //The server will respond with JSON that contains the user input, which is stored in req.body. res.json(req.body) is the initial test to see if json data is rendered.

  //////// code for form validator
  //req.validationErrors(true) // for mapping errors
  req.checkBody("tutorial[title]", "A tutorial title must be entered").notEmpty();
  req.checkBody("tutorial[comment]", "A description of your code must be entered").notEmpty();
  req.checkBody("tutorial[htmlCode]", "HTML code must be entered").notEmpty();
  req.checkBody("tutorial[cssCode]", "CSS code must be entered").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    Tutorial.find().sort({title:1}).then(function(tutorials){
      res.render('form', {errors: errors, tutorials: tutorials}) // this will render tutorials in nav bar and any errors that may occur
    })
    return;
    /////// end code for form validator
  } else {
    req.body.tutorial.title = req.body.tutorial.title.trim();
    Tutorial.create(req.body.tutorial).then(function(tutorial){
      res.redirect("/" + tutorial.title);

    });
  }
});

// edit post
app.post("/edit-form/:title", function(req, res){
  // req.checkBody("tutorial[title]", "A tutorial title must be entered").notEmpty();
  // req.checkBody("tutorial[comment]", "A description of your code must be entered").notEmpty();
  // req.checkBody("tutorial[htmlCode]", "HTML code must be entered").notEmpty();
  // req.checkBody("tutorial[cssCode]", "CSS code must be entered").notEmpty();
  //
  // var errors = req.validationErrors();
  // if (errors) {
  //  res.render("/edit-form/" + tutorial.title, {errors: errors})
  //     return;
  //  /////// end code for form validator
  //  } else {
  Tutorial.findOneAndUpdate({title: req.params.title}, req.body.tutorial, {new: true}).then(function(tutorial){ //req.body.tutorial is the object of all my tutorial attributes
    res.redirect("/" + tutorial.title );

  });
  //} // remove this if I'm not validating code
});


app.listen(app.get("port"), function(){
  console.log("I work on localhost:3001");
});
