const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const DbMongo = require('mongodb').Db;
const Server = require('mongodb').Server;

const url = "mongodb://localhost:27017/Chat";

const messageSchema = new Schema({
  message  : {
    type : String,
    required : true
  },

  sendTime : {
    type : Date,
    default : Date.now
  }
});

const Messages = module.exports = mongoose.model("Messages", messageSchema);

messageSchema.pre('save', function(next){
  console.log("Saving Now!");
  next();
})

module.exports.getData = function(db, callback){
  //const DbMongoConnection = new DbMongo('Chat', new Server('localhost', 27017)); // Database Connection for another mongo connections

  const collection = db.collection('messages');

  const cursor = collection.find({});

  collection.find({}).toArray(function(err, docs){
    assert.equal(null, err);
    callback(docs);
  })

}

module.exports.insertData = function(data, callback){

  mongoose.connect(url);
  const MongooseConnect = mongoose.connection;

  Messages.create(data, function(err, callback){
    if(err){
      throw err;
    }
    //console.log("Inserting : " + callback);
    MongooseConnect.close();
  });
}
