let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
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

exports.getMovieByName = function(name,done){
    let st = ".*" + name.toString() + ".*";
    movieSchema.find({"name": {$regex : st}}).lean().exec(function (err, movies) {
        if (err) {
            done(err);
        } else {
            done(null, movies);
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

exports.getMovieReviews = function (movieId, done) {
    reviewSchema.find({"movieId":movieId}).exec(function (err,reviews) {
        if(err){
            done(err);
        }else {
            done(null, reviews);
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



































