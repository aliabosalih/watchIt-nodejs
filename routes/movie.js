const express = require('express'),
        router = express.Router(),
    moviesCtrl = require('../controllers/movie'),
    omdbCtrl = require('../controllers/omdb'),
    HashMap = require('hashmap')

router.get('/getMoviesByRate/:skip', function (req, res) {
    moviesCtrl.getMoviesByRatings(req.params.skip, function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

router.get('/reviews/:movieId', function (req, res) {
    moviesCtrl.getMovieReviews(req.params.movieId.toString(), function (err, reviews) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(reviews);
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

router.get('/:movieName', function (req, res) {
    moviesCtrl.getMovieByName(req.params.movieId.toString(), function (err, movie) {
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
router.get('/filterMoviesByGenre/:genre/:skip', function (req, res) {
    moviesCtrl.filterMoviesByGenres(req.params, function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

/**
 * get the Genres array in the body
 */
router.post('/add', function (req, res) {
    moviesCtrl.addMovie(req.body, function (err, movie) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});


router.get('/searchByNameReviewed/:name', function (req, res) {
    moviesCtrl.getMovieByName(req.params.name, function (err, movies) {

        if (err) 
        {
            res.status(500).json(err);
        }
        else 
        {
            res.status(200).json(movies);
        }
    });
});



router.get('/searchByNameAll/:name', function (req, res) {
    moviesCtrl.getMovieByName(req.params.name, function (err, movies) {

        if (err) 
        {
            res.status(500).json(err);
        }
        else 
        {
            omdbCtrl.omdbGetMovieByName(req.params.name, function (err1, movies1) {

                    if (err1) 
                    {
                        res.status(500).json(err1);
                    }
                    else 
                    {
                        var allMovies = movies.concat(movies1)
                        var hashMap = new HashMap()

                        for (let i = 0 ; i < allMovies.length ; i++)
                        {
                            (function(i){
                                if(!hashMap.get(allMovies[i].name)){
                                     hashMap.set(allMovies[i].name.toString(),allMovies[i]);
                                }
                            })(i)
                            
                        }

                        res.status(200).json(hashMap.values())
                    }

                });
        }
    });
});

module.exports = router;