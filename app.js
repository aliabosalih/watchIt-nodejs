var express = require('express');
var app = express();


let mongoose = require('mongoose');
let db = "mongodb://ds231460.mlab.com:31460/watchit-db"
let db_options = {
	  "user": "watchit",
          "pass" : "!Q@W#E$R%T6y",
	  "ssl": false
	};
var Schema = mongoose.Schema;





let  userSchema = new Schema({"name": String});
let user = mongoose.model('users', userSchema);


let mongodb = mongoose.createConnection(db,db_options);
let users = mongodb.model('users');
users.find({"name":"ali"},function(err,up){
console.log(err,up);

});
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
