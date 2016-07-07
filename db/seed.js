var mongoose = require("./connection"); //sets connection to database
// var seedData = require("./seeds");

var Account = mongoose.model("Account");
var Tutorial = mongoose.model("Tutorial");

Tutorial.remove({}).then(function(){
  Tutorial.collection.insert(seedData).then(function(){
    process.exit(); // create a collection using the JSON contained in seed file
  });
});

Account.remove({}).then(function(){
  Acount.collection.insert(seedData).then(function(){
    process.exit();
  });
});

// function addTutorials(owner){
//   // .remove clears entire database
//   Tutorial.remove({}).then(function(){
//     Tutorial.collection.insert([
//       { title: "title1", comment: "comment1", owner: owner._id},
//       { title: "title2", comment: "comment1", owner: owner._id},
//     ]).then(function(){
//       process.exit(); // create a collection using the JSON contained in seed file
//     }).catch(function(err){
//       console.log("tut err:", err)
//       process.exit(); // create a collection using the JSON contained
//     });
//   });
// }

// remember to do npm init and npm install when using Node! 
// check js file at http://jsonlint.com/

// Steps for seeding file
// 1. $node db/seed.js
// 2. use cheatss   (do this in mongo)  cheatss is database name from connection.js
// 3. db.tutorials.find()               make sure your json data shows up when you do this


// steps for dropping database
// use databasename
// db.runCommand( { dropDatabase: 1 } )
