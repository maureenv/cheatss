// used to connect to Mongo
// connection.js should only serve as a connection between app and database. Should NOT contain seed data
var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');

var TutorialSchema = new mongoose.Schema(
  {
    title: String,
    comment: String,
    demoLink: String,
    htmlCode: String,
    cssCode: String,
    jsCode: String,
    owner: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Account'
       },
  }
);

var Account = new mongoose.Schema({
    username: String,
    password: String
    // tutorials: [{
    //        type: Schema.Types.ObjectId,
    //        ref: 'Tutorial'
    //    }]
});

Account.plugin(passportLocalMongoose);

mongoose.model('Account', Account);
mongoose.model("Tutorial", TutorialSchema); //"Tutorial" is name of model and TutorialSchema is name of desired Schema
//mongoose.connect("mongodb://localhost/cheatss") //cheatss is database name

if(process.env.NODE_ENV == "production"){
  mongoose.connect(process.env.MONGODB_URI); // make sure this says MONGODB NOT MONGOLAB
}else{
  mongoose.connect("mongodb://localhost/cheatss");
} //heroku attempt

module.exports = mongoose;
// in order to connect to Mongo need to do $mongo and $mongod in different tabs

// Mongoose is an ORM (object-relational mapping) we can use to represent data from a Mongo database as models in a Javascript back-end.
