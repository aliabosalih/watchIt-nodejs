let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');
let userCtrl = require('./user');
let movieTrailer = require('movie-trailer');
let omdb = require('./omdb');

const getUserAndUpdateReview = function (data, review, done) {
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
        // let movie = new movieSchema;
        let mv = {"results": [data.movie]}
        let movie = omdb.getMoviesSchemaFromOmdbJson(mv);
        let year = movie[0].released.split(" ")[0];
        console.log("yeaaaaaar",year);
        movieTrailer(movie[0].name, Number(year), function (err, trailer) {
            console.log(err, trailer)
            if (err) {
                movie[0].trailer = "";
            } else {
                movie[0].trailer = trailer;
            }
            movie[0].save(function (err, movie) {
                if (err) {
                    done(err);
                } else {
                    review.movieId = movie._id;
                    getUserAndUpdateReview(data, review, done);
                }
            });
        });
    } else {
        movieSchema.findOne({_id: data.movieId}).exec(function (err, mov) {
            console.log("...........", mov)
            let newAvg = (mov.ratersSum + data.rate) / (mov.ratersCounter + 1);
            movieSchema.findOneAndUpdate({_id: data.movieId}, {
                $inc: {ratersCounter: 1, ratersSum: data.rate},
                $set: {"watchitRatings": newAvg}
            }).exec(function (err, movie) {
                if (err) {
                    done(err);
                } else {
                    getUserAndUpdateReview(data, review, done);
                }
            });
        });
    }
};