let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');
let userCtrl = require('./user');

const setValues = function (movie, data) {
    movie.name = data.Title;
    movie.description = data.Plot;
    movie.runTime = data.Runtime;
    movie.image = data.Poster;
    movie.language = data.Language;
    movie.genre = data.Genre;
    movie.released = data.Released;
    movie.imdbRatings = data.imdbRating;
    movie.watchitRatings = data.rate;
    movie.ratersCounter = 1;
    movie.writer = data.Writer;
    movie.actors = data.Actors
    movie.awards = data.Awards;
    return movie;
};

const getUserAndUpdateReview= function(data,review,done){
    userCtrl.getUserById(data.userId, function (err, user) {
        if (err) {
            done(err);
        } else {
            let u = {
                "name": user.name,
                "age": user.age,
                "facebookId": user.facebookId,
                "image": user.image,
                "userId": data.userId
            };
            review.user = JSON.parse(JSON.stringify(u));
            review.save(function (err, user) {
                if (err) {
                    done(err, null);
                    console.log("create review error ", err);
                } else {
                    done(null, user);
                    console.log("created review!", user);
                }
            });
        }
    });
};
exports.addReview = function (data, done) {
    let review = new reviewSchema;
    review.movieId = data.movieId;
    review.userId = data.userId;
    review.comment = data.comment;
    review.rate = data.rate;
    if (!data.movieId) {
        let movie = new movieSchema;
        setValues(movie, data.movie);
        movie.ratersSum = data.rate;
        movie.rateAvg = data.rate;
        movie.save(function (err, movie) {
            if (err) {
                done(err);
            } else {
                review.movieId = movie._id;
                getUserAndUpdateReview(data,review,done);
            }
        });
    } else {
        movieSchema.findOne({_id:data.movieId}).exec(function (err,mov) {
            let newAvg = (mov.ratersSum + data.rate )/ (mov.ratersCounter+1);
            movieSchema.findOneAndUpdate({_id:data.movieId},{$inc:{ratersCounter:1,ratersSum:data.rate},$set:{"rateAvg":newAvg}}).exec(function(err,movie){
                if(err){
                    done(err);
                }else{
                    getUserAndUpdateReview(data,review,done);
                }
            });
        });
    }
};