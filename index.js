const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const DbMongo = require('mongodb').Db;
const Server = require('mongodb').Server;

const DbMessages = require('./models/messages');

const bodyParser = require('body-parser');
const port = 3000;

const server = require('http').createServer(app); // Creating Server!

const io = require('socket.io').listen(server); // Socket IO!

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended : false});

app.set('view engine', 'pug');

const url = "mongodb://localhost:27017/Chat";

var count = 0; //connection count

app.use(express.static("./public"));

app.get("/", function(req, res){

  MongoClient.connect(url, function(err, db){
    assert.equal(null, err);

    DbMessages.getData(db, function(callback){
      if(err){
        throw err;
      }

      res.render('index', {messages : callback});
    })

    db.close();

  });

})

io.on("connection", (client) => {

  count++;//current user count.

  console.log("Client " + count + " connected to socket");

  client.on("joined", (data) => {
    console.log("Joined data : " + data);
  })

  client.emit("messages", "Hello World From Server For Connection");

  client.on("messages", (data) => {

    const MongooseConnect = mongoose.connection;

    DbMessages.insertData(data, function(err, callback){
      if(err){
        throw err;
      }
      console.log("Inserted data from MESSAGES ON! callback : " + callback);

      MongooseConnect.close();
    })

    client.emit("broad", data.message);
    client.broadcast.emit("broad", data.message);

  })

  client.on("disconnect", (data) => {
    console.log("Client " + count + " has disconnected");
    count--;
  })
})




server.listen(port, ()=>{
  console.log("Server is listening on : " + port);
});
