let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');
    let userCtrl = require('./user');



exports.addReview = function(data,done){
    let review = new reviewSchema;
    review.movieId  = data.movieId;
    review.userId  = data.userId;
    review.comment  = data.comment;
    review.rate  = data.rate;

    userCtrl.getUserById(data.userId,function (err, user) {
        if(err){
            done(err);
        }else {
            let u = {};
            u.name = user.name;
            u.age = user.age;
            u.facebookId = user.facebookId;
            u.image = user.image;
            u.userId = data.userId;
            review.user = JSON.parse(JSON.stringify(u));

        }



    });
}