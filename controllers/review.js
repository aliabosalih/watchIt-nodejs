let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
    fcmTokens = mongoDB.mongodb.model('userFcmTokenSchema'),
    User = mongoDB.mongodb.model('userSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');
let userCtrl = require('./user');
let movieTrailer = require('movie-trailer');
let omdb = require('./omdb');
let fcmCtrl = require('./fcm');




function notifyOwner(data,movie){
    console.log("data issss ",data , movie)
    User.findOne({_id:data.userId}).exec(function (err,user) {
        if(err){
            console.log("err in 49 review",err)
        }else{
            fcmTokens.findOne({userId:movie.owner}).exec(function (error,tokenD) {
                if(error || !tokenD){
                    console.log("error in 53 review",error)
                }else{
                    let token = tokenD.fcmToken;
                    let notification = {
                        title: 'new comments',
                        body: user.name + ' reviewd your movie! take a look'
                    };
                    fcmCtrl.sendNotification(notification,token.toString(),movie._id);
                }
            });
        }
    })

}

function getUsersWithGenres(genre,done){
    User.aggregate([{$unwind:"$genres"},{$match:{"genres":genre}}]).exec(function (err, users) {
        if(err){
            console.log(err)
            done(err)
        }else{
            console.log("................",users);
            let ids = [];
            for(let i = 0 ; i < users.length; i++){
                ids.push(users[i]._id)
            }
            done(null,ids)
        }
    })
}

exports.getUsersWithGenres = getUsersWithGenres;

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
                    movieSchema.findOne({_id:review.movieId}).lean().exec(function(errr,movie){
                        if(err){
                            done(err);
                        }else{
                            if(movie.owner !== data.userId && data.firstTime != 1) {
                                console.log("hereeeeeeeeeee ------------ ",data.userId,movie.owner)
                                notifyOwner(data,movie);
                            }
                            console.log("created review!", movie);
                            done(null, movie);
                        }
                    })
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
        let mv = {"results": [data.movie]};
        let movie = omdb.getMoviesSchemaFromOmdbJson(mv);
        let year = movie[0].released.split(" ")[0];
        movie[0].watchItRating = data.rate;
        movie[0].ratersCounter = 1;
        movie[0].ratersSum = data.rate;
        movieTrailer(movie[0].name, Number(year), function (err, trailer) {
            console.log(err, trailer)
            if (err) {
                movie[0].trailer = "6hB3S9bIaco";
            } else {
                let trailerSplited = trailer.split("?v=")[1];
                movie[0].trailer = trailerSplited;
            }
            movie[0].owner = data.userId;
            movieSchema.findOne({"name":movie[0].name}).lean().exec(function(err,mov){
                if(err){
                    done(err);
                }else{
                    if(!mov){
                        movie[0].save(function (err, movie) {
                            if (err) {
                                done(err);
                            } else {
                                review.movieId = movie._id;
                                // call back handle the notification for the preffer genres for other users.!
                                // getUserAndUpdateReview(data, review,done);
                                data.firstTime = 1;
                                getUserAndUpdateReview(data, review, function(err,movie){
                                    getUsersWithGenres(movie.genre,function(err,ids){
                                        fcmTokens.find({userId:{$in:ids}}).lean().exec(function(err,tokensDoc){
                                            for(let j= 0 ; j < tokensDoc.length;j++){
                                                if(review.userId != tokensDoc[j].userId){
                                                    let token = tokensDoc[j].fcmToken;
                                                    let notification = {
                                                        title: "new movies in your preferred genres",
                                                        body:  "add your review for " + movie.name + " - from your preferred genres in watchIt!"
                                                    };
                                                    fcmCtrl.sendNotification(notification,token.toString(),movie._id);
                                                }
                                            }
                                            return done(null,movie);
                                        })
                                    })
                                });
                            }
                        });
                    }else{
                        let newAvg = (Number(mov.ratersSum) + data.rate) / (mov.ratersCounter + 1);
                        review.movieId = mov._id;
                        movieSchema.findOneAndUpdate({_id:  mov._id}, {
                            $inc: {ratersCounter: 1, ratersSum: data.rate},
                            $set: {"watchItRating": newAvg}
                        }).exec(function (err, movie1) {
                            if (err) {
                                done(err);
                            } else {
                                getUserAndUpdateReview(data, review, done);
                            }
                        });
                    }
                }
            });
        });
    } else {
        movieSchema.findOne({_id: data.movieId}).exec(function (err, mov) {
            let newAvg = (Number(mov.ratersSum) + data.rate) / (mov.ratersCounter + 1);
            movieSchema.findOneAndUpdate({_id: data.movieId}, {
                $inc: {ratersCounter: 1, ratersSum: data.rate},
                $set: {"watchItRating": newAvg}
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