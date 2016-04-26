// used to connect to Mongo
// connection.js should only serve as a connection between app and database. Should NOT contain seed data
var mongoose = require("mongoose");

var TutorialSchema = new mongoose.Schema(
  {
    title: String,
    comment: String,
    demoLink: String,
    htmlCode: String,
    cssCode: String,
    jsCode: String
  }
);

mongoose.model("Tutorial", TutorialSchema); //"Tutorial" is name of model and TutorialSchema is name of desired Schema
// mongoose.connect("mongodb://localhost/cheatss") //cheatss is database name
mongoose.connect("mongodb://127.0.0.1:27017/cheatss")
module.exports = mongoose;
// in order to connect to Mongo need to do $mongo and $mongod in different tabs

// Mongoose is an ORM (object-relational mapping) we can use to represent data from a Mongo database as models in a Javascript back-end.
