var express = require("express");
var parser  = require("body-parser");
var validator = require("express-validator");
var hbs     = require("express-handlebars");
var app     = express();
var mongoose =require("./db/connection"); //connection to database
var Tutorial = mongoose.model("Tutorial");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

// validation tutorial https://booker.codes/input-validation-in-express-with-express-validator/
// pushing to heroku


app.use("/public", express.static("public")) // the "/public" part can say anything its what shows up in URL, but "public" must say public.
app.use(logger('dev'));
app.use(parser.json());
app.use(parser.urlencoded({extended: true})); //makes body parser support html forms
app.use(validator());
app.use(cookieParser());
// app.use(require('express-session')({
//   secret: "thuglifecats",
//   resave: false,
//   saveUninitialized: false
// }));
app.use(session({
  secret: "thuglifecats",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// passport config
var mongoose = require('./db/connection');
Account = mongoose.model("Account");
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


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
      tutorials: tutorials, // to render tutorials in nav bar
      user : req.user
    })
  })
  .catch(function(error){
    console.log(error);
    res.send(error);
  }) //render this in layout-main body tag
});



app.get("/form", function(req, res){
  console.log("params", req.params)
  console.log("body", req.body)
  // res.render("welcome", {
  //     tutorials: db.tutorials
  Tutorial.find().sort({title:1}).then(function(tutorials){
    res.render("form", {
      tutorials: tutorials // to render tutorials in nav bar
    })
  }) //render this in layout-main body tag
});

app.get('/register', function(req, res) {
  Tutorial.find().sort({title:1}).then(function(tutorials){
    res.render("register", {
      tutorials: tutorials // to render tutorials in nav bar
    })
  }) //
});

app.get('/login', function(req, res) {
  Tutorial.find().sort({title:1}).then(function(tutorials){
    res.render('login', {
        user : req.user,
        tutorials: tutorials
     });
  })
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.get("/edit-form/:title", function(req, res){
  Tutorial.findOne({title: req.params.title}).populate('owner').then(function(tutorial){
    Tutorial.find().sort({title:1}).then(function(tutorials){
      var user = req.user;
      var currentUserIsOwner = false;
      if (user){
        currentUserIsOwner = (user.username == tutorial.owner.username)
      }
      res.render("edit-form", {
        tutorial: tutorial,
        tutorials: tutorials,// render all tutorials in nav bar
        user : user,
        currentUserIsOwner: currentUserIsOwner
      })
    })
  });
});

app.get("/:title", function(req, res){
  console.log("params", req.params)
  console.log("body", req.body)
  Tutorial.findOne({title: req.params.title}).populate('owner').then(function(tutorial){
    Tutorial.find().sort({title:1}).then(function(tutorials){ // to render tutorials in nav bar
      var user = req.user;
      var currentUserIsOwner = false;
      if (user){
        currentUserIsOwner = (user.username == tutorial.owner.username)
      }

      res.render("tutorials-show", {
        tutorial: tutorial,
        tutorials: tutorials, // to render tutorials in nav bar
        user : user,
        currentUserIsOwner: currentUserIsOwner
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
  console.log("params", req.params)
  console.log("body", req.body)

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

    tutorial = req.body.tutorial;
    tutorial.title = tutorial.title.trim();
    tutorial.owner = req.user._id;

    Tutorial.create(tutorial).then(function(tutorial){
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

/////////////////////// Routes for USERS
app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      req.checkBody("username", "A username must be entered.").notEmpty();
      req.checkBody("password", "A password must be entered.").notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        Tutorial.find().sort({title:1}).then(function(tutorials){
          res.render('register', {errors: errors, tutorials: tutorials}) // this will render tutorials in nav bar and any errors that may occur
        })
        return;
        /////// end code for form validator
      } else {
        if (err) {
            return res.render('register', { account : account });
        }
        req.body.username = req.body.username.trim();
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
      }
    });
});


app.post('/login', passport.authenticate('local'), function(req, res) {
  req.checkBody("username", "A username must be entered.").notEmpty();
  req.checkBody("password", "A password must be entered.").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    Tutorial.find().sort({title:1}).then(function(tutorials){
      res.render('login', {errors: errors, tutorials: tutorials}) // this will render tutorials in nav bar and any errors that may occur
    })
    return;
    /////// end code for form validator
  } else {
    res.redirect('/');
  }
});

app.listen(app.get("port"), function(){
  console.log("I work on localhost:3001");
});
