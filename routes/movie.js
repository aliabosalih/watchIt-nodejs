const express = require('express'),
    router = express.Router();

let moviesCtrl = require('../controllers/movie');

router.get('/movie/getMoviesByRate/:sortKey', function (req, res) {
    moviesCtrl.getMoviesByRatings(req.params.sortKey.toString(), function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

router.get('/movie/comments/:movieId', function (req, res) {
    moviesCtrl.getMovieComments(req.params.sortKey.toString(), function (err, comments) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(comments);
        }
    });
});

router.get('/movie/:movieId', function (req, res) {
    moviesCtrl.getMovieById(req.params.movieId.toString(), function (err, movie) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movie);
        }
    });
});

router.get('/movie/getMoviesByGenre/:sortKey', function (req, res) {
    moviesCtrl.getMoviesByRatings(req.params.sortKey.toString(), function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

module.exports = router;
