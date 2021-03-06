let mongoDB = require('../MongoDB'),
    userSchema = mongoDB.mongodb.model('userSchema'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema');
let fcmToken = mongoDB.mongodb.model('userFcmTokenSchema');

const getUserByFacebookId = (id, done) => {

    var query = userSchema.find({'facebookId': id});
    query.exec(function (err, users) {
        if (err) {

            done(err, null);
            console.log("get user error :", err);
        }
        else {
            console.log("retTTTTT users", users);
            done(null, users[0]);
        }
    });
};
const updateUser = (data, done) => {
    userSchema.findOneAndUpdate({"_id": data._id}, {
        $set: {
            "genres": data.genres
        }
    }, {new: true}).exec(function (err, user) {
        if (err) {
            if (!user) {
                console.log("user doesn't exist", err);
                done("User Not Exists");
            } else {
                console.log("update user error ", err);
                done(err, null);
            }
        } else {
            console.log("updated  user!", user);
            done(null, user);
        }
    });
};
exports.updateUser = updateUser;
let async = require('async');

const getReviewdMovies = (id, done) => {
    let reviewsArr = [];
    let asyncFuncs = [];
    reviewSchema.find({userId: id}).lean().exec(function (err, reviews) {
        if (err) {
            done(err)
        } else {
            if (reviews.length == 0) {
                done("no reviewed movies yet!");
            } else {
                console.log(reviews)

                for (let i = 0; i < reviews.length; i++) {
                    (function (i) {
                        asyncFuncs.push(function (callback) {
                            movieSchema.findOne({_id: reviews[i].movieId}).lean().exec(function (err, movie) {
                                if (err) {
                                    console.log(err);
                                }
                                let m = JSON.parse(JSON.stringify(reviews[i]))
                                //console.log("//////",m)
                                m["movie"] = movie;
                                reviewsArr.push(m);
                                return callback(null);
                            });
                        });
                    })(i);
                }
                async.parallel(asyncFuncs, function (err, reviewss) {
                    if (err) {
                        console.log("74 ------ ", err);
                    } else {
                        console.log("-----", reviewsArr)
                        done(null, reviewsArr)
                    }
                });
                // movieSchema.find({_id:{$in:reviews}}).lean().exec(function (err,movies) {
                //    if(err){
                //        console.log("err in 56",err);
                //        done(err);
                //    } else{
                //        done(null,movies);
                //    }
                // });
            }
        }
    });
};

exports.getReviewdMovies = getReviewdMovies;

const createUser = (user, done) => {
    let a = new userSchema();
    a.name = user.name;
    a.facebookId = user.facebookId;
    a.image = user.image;
    a.genres = [];
    //"https://www.telegraph.co.uk/content/dam/science/2017/10/22/TELEMMGLPICT000144108354_trans_NvBQzQNjv4BqZqbNnzMENeQWOPqPMX-4IhRy7TN-7bbEnHI_PZtKCtQ.jpeg?imwidth=450";
    a.save(function (err, user) {
        if (err) {
            console.log("create user error ", err);
            done(err, null);
        } else {
            console.log("created user!", user);
            let u = {};
            u._id = user._id;
            u.facebookId = user.facebookId;
            u.image = user.image;
            u.name = user.name;
            done(null, u);
        }
    });
}
const getUserById = (userId, done) => {
    console.log("userId", userId)
    userSchema.findOne({'_id': userId}).lean().exec(function (err, user) {
        if (err || !user) {
            done(err || "User Not Found!");
        }
        else {
            fcmToken.findOne({userId: userId}).lean().exec(function (err, token) {
                if (err) {
                    console.log(err);
                } else {
                    if (token) {
                        console.log("token", token, token.onOff, typeof token.onOff);
                        user["notifyMe"] = token.onOff;
                    }
                    done(null, user);
                }
            });
        }
    });
}

exports.getUserById = getUserById;
exports.getUserByFacebookId = getUserByFacebookId;
exports.createUser = createUser;