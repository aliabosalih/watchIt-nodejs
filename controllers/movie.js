let mongoDB = require('../MongoDB'),
    movieSchema = mongoDB.mongodb.model('movieSchema'),
    reviewSchema = mongoDB.mongodb.model('reviewSchema'),
    userMovieRelSchema = mongoDB.mongodb.model('userMovieRelation');


exports.getMovieById = function (id, done) {
    movieSchema.findOne({"_id": id}).lean().exec(function (err, movie) {
        if (err) {
            done(err);
        } else {
            done(null, movie);
        }
    });
};

exports.getMovieByName = function (name, done) {
    let st = ".*" + name.toString() + ".*";
    let re= new RegExp([st].join(""), "i");
    movieSchema.find({"name": {$regex: st, '$options' : 'i'}}).lean().exec(function (err, movies) {
        if (err) {
            console.log(err);
            done(err);
        } else {
            console.log(movies);
            done(null, movies);
        }
    });
};

exports.getMoviesByRatings = function (skip, done) {
    movieSchema.find({}).sort({"watchitRatings": -1}).skip(Number(skip)).limit(10).lean().exec(function (err, sortedMovies) {
        if (err) {
            done(err);
        } else {
            done(null, sortedMovies);
        }
    });

};

exports.getMovieReviews = function (movieId, done) {
    reviewSchema.find({"movieId": movieId}).exec(function (err, reviews) {
        if (err) {
            done(err);
        } else {
            done(null, reviews);
        }
    });
};

exports.getMovieOwner = function (movieId, done) {
    userMovieRelSchema.find({"movieId": movieId, "relation": "owner"}).exec(function (err, owner) {
        if (err) {
            done(err);
        } else {
            done(null, owner);
        }
    });
};


exports.filterMoviesByGenres = function (genreArr, done) {
    let genre = "Action";
    let skip = 0 ;
    skip = genreArr.skip;
    genre = genreArr.genre;

    movieSchema.find({"genre":genre}).sort({"watchitRatings": -1}).lean().exec(function (err, filteredMovies) {
        if (err) {
            done(err);
        } else {
            done(null, filteredMovies);
        }
    });
};

exports.addMovie = function (data,done) {
    let movie = new movieSchema();
    movie["name"] = data.name;
    movie["description"] = data.description;
    movie["runTime"] = data.runTime;
    movie["image"] = data.image;
    movie["language"] = data.language;
    movie["genre"] = data.genre;
    movie["released"] = data.released;
    movie["imdbRatings"] = data.imdbRatings;
    movie["watchitRatings"] = data.watchitRatings;
    movie["writer"] = data.writer;
    movie["awards"] = data.awards;
    movie["actors"] = data.actors;
    movie["ratersCounter"] = data.ratersCounter;
    movie.save(function (err, m) {
        if (err) {
            console.log("create movie error ", err);
            done(err, null);
        } else {
            console.log("created movie!", m);
            done(null, m);
        }
    });
}


































