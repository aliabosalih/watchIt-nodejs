const express = require('express'),
    router = express.Router();

let reviewsCtrl = require('../controllers/review');

/**
 * body : {
    "movieId": Schema.ObjectId,
    "userId": Schema.ObjectId,
    "comment": String,
    "user": {
        "name": String,
        "age": Number,
        "facebookId": String,
        "image": String
    },
    "rate": Number
    }
 */
router.post('/add', function (req, res) {
    reviewsCtrl.addReview(req.body,function (err, review) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(review);
        }
    });

});
let moviesCtrl = require('../controllers/movie')
router.get('/:movieId', function (req, res) {
    moviesCtrl.getMovieReviews(req.params.movieId.toString(), function (err, reviews) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(reviews);
        }
    });
});


module.exports = router;
