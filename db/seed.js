var mongoose = require("./connection"); //sets connection to database
var seedData = require("./seeds");

var Tutorial = mongoose.model("Tutorial");

// .remove clears entire database
Tutorial.remove({}).then(function(){
  Tutorial.collection.insert(seedData).then(function(){
    process.exit(); // create a collection using the JSON contained in seed file
  });
});

// Steps for seeding file
// 1. $node db/seed.js
// 2. use cheatss   (do this in mongo)  cheatss is database name from connection.js
// 3. db.tutorials.find()               make sure your json data shows up when you do this
