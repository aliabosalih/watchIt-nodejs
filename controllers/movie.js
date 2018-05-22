let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    commentSchema = mongoDB.mongodb.model('commentSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');


exports.getMovieById = function(id,done){
    movieSchema.findOne({"_id":id}).lean().exec(function (err, movie) {
        if (err) {
            done(err);
        } else {
            done(null, movie);
        }
    });
};

exports.getMoviesByRatings = function (key, done) {
    movieSchema.find({}).sort({key: -1}).lean().exec(function (err, sortedMovies) {
        if (err) {
            done(err);
        } else {
            done(null, sortedMovies);
        }
    });

};

exports.getMovieComments = function (movieId, done) {
    commentSchema.find({"movieId":movieId}).exec(function (err,comments) {
        if(err){
            done(err);
        }else {
            done(null, comments);
        }
    });
};

exports.getMovieOwner= function (movieId,done) {
    userMovieRelSchema.find({"movieId":movieId,"relation":"owner"}).exec(function(err,owner){
        if(err){
            done(err);
        }else{
            done(null,owner);
        }
    });
};


exports.filterMoviesByGenres = function (genreArr, done) {
    let query = {};
    if(genreArr.length > 0){
        genreArr["Genre"] ={$in:genreArr};
    }
    movieSchema.find(query).sort({"watchitRatings": -1}).lean().exec(function (err, filteredMovies) {
        if (err) {
            done(err);
        } else {
            done(null, filteredMovies);
        }
    });
};

