const express = require('express'),
    router = express.Router(),
    moviesCtrl = require('../controllers/movie') , 
    omdbCtrl = require('../controllers/omdb');


router.get('/getMoviesByRate/:sortKey', function (req, res) {
    moviesCtrl.getMoviesByRatings(req.params.sortKey.toString(), function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

router.get('/comments/:movieId', function (req, res) {
    moviesCtrl.getMovieComments(req.params.sortKey.toString(), function (err, comments) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(comments);
        }
    });
});

router.get('/:movieId', function (req, res) {
    moviesCtrl.getMovieById(req.params.movieId.toString(), function (err, movie) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movie);
        }
    });
});

/**
 * get the Genres array in the body
 */
router.post('/filterMoviesByGenre', function (req, res) {
    moviesCtrl.filterMoviesByGenres(req.body, function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});


router.get('/searchByName/:name' , function(req , res){

    omdbCtrl.omdbGetMovieByName(req.params.name , function(err , movie){

        if(err)
        {
            res.status(500).json(err);
        }
        else
        {
            res.status(200).json(movie);
        }

    });

});

module.exports = router;




















































