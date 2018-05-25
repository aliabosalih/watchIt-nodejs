
let mongoose = require('mongoose');
let db = "mongodb://ds231460.mlab.com:31460/watchit-db"
let db_options = {
    "user": "watchit",
    "pass": "!Q@W#E$R%T6y",
    "ssl": false
};
var Schema = mongoose.Schema;



let userSchema = new Schema({"name": String,
    "facebookId": String,
    "image": String,
    "genres":[String]});
let user = mongoose.model('userSchema', userSchema);


let movieSchema = new Schema({
    "name": String,
    "description": String,
    "image": String,
    "language": String,
    "genre": String,
    "watchitRatings": Number,
    "ratersCounter": Number,
    "ratersSum" : Number,
    "rateAvg" : Number,
    "trailer":String
});
let movies = mongoose.model('movieSchema', movieSchema);


let userMovieSchema = new Schema({
    "movieId": Schema.ObjectId,
    "userId": Schema.ObjectId,
    "relation": String,
    "rate": Number
});
let userMovieRelation = mongoose.model('userMovieRelation', userMovieSchema);


let reviewSchema = new Schema({
    "movieId": Schema.ObjectId,
    "userId": Schema.ObjectId,
    "comment": String,
    "user": {
        "name": String,
        "age": Number,
        "facebookId": String,
        "image": String,
        "userId": Schema.ObjectId
    },
    "rate": Number
});

let reviewSchemas = mongoose.model('reviewSchema', reviewSchema);
let mongodb = mongoose.createConnection(db, db_options);


exports.mongodb = mongodb;
