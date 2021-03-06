const express = require('express'),
        router = express.Router(),
    moviesCtrl = require('../controllers/movie'),
    omdbCtrl = require('../controllers/omdb'),
    HashMap = require('hashmap').HashMap;



router.post('/search/ByNameReviewed', function (req, res) {
    if(req.body.name == ""){
        moviesCtrl.getMoviesByRatings(0, function (err, movies) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(movies);
            }
        });
    }else{
        moviesCtrl.getMovieByName(req.body.name, function (err, movies) {

            if (err)
            {
                res.status(500).json(err);
            }
            else
            {
                res.status(200).json(movies);
            }
        });
    }
});



router.post('/search/ByNameAll', function (req, res) {
    console.log("body in search",req.body.name)
    if(req.body.name == ""){
        moviesCtrl.getMoviesByRatings(0, function (err, movies) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(movies);
            }
        });
    }else {
        moviesCtrl.getMovieByName(req.body.name, function (err, movies) {
            if (err) {
                res.status(500).json(err);
            }
            else {
                omdbCtrl.omdbGetMovieByName(req.body.name, function (err1, movies1) {
                    if (err1) {
                        console.log("movies1")

                        res.status(500).json(err1);
                    }
                    else {
                        console.log("movies1",movies1)
                        var allMovies = movies;
                        var hashMap = new HashMap()
                        for (let ij = 0; ij < allMovies.length; ij++) {
                            (function (ij) {
                                if (!hashMap.get(allMovies[ij].name)) {
                                    hashMap.set(allMovies[ij].name.toString(), allMovies[ij]);
                                }
                            })(ij)
                        }
                        if(movies1){
                            allMovies = movies.concat(movies1)
                        }


                        for (let i = 0; i < allMovies.length; i++) {
                            (function (i) {
                                if (!hashMap.get(allMovies[i].name)) {
                                    hashMap.set(allMovies[i].name.toString(), allMovies[i]);
                                }
                            })(i)
                        }
                        console.log("search results :", hashMap.values())
                        res.status(200).json(hashMap.values())
                    }

                });
            }
        });
    }
});

router.get('/getMoviesByRate/:skip', function (req, res) {
    moviesCtrl.getMoviesByRatings(req.params.skip, function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

router.get('/getMoviesByFilter/:filter/:skip', function (req, res) {
    moviesCtrl.getMoviesBySort(req.params.filter,req.params.skip, function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});

router.get('/getRecommended/:id/:skip', function (req, res) {
    moviesCtrl.getMyRecommendedId(1,req.params.id,req.params.skip ,function (err, movies) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(movies);
        }
    });
});


router.post('/getRecommended/:sort/:skip', function (req, res) {
    moviesCtrl.getMyRecommended(req.params.sort,req.body.genres,req.params.skip ,function (err, movies) {
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

router.get('/movie/:movieName', function (req, res) {
    moviesCtrl.getOneMovieByName(req.params.movieName.toString(), function (err, movie) {
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
router.get('/filterMoviesByGenre/:genre/:sortby/:skip', function (req, res) {
    if(req.params.genre.toString().toLowerCase() === "all"){
        moviesCtrl.getMoviesBySort(req.params.sortby,req.params.skip, function (err, movies) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(movies);
            }
        });
    }else {
        moviesCtrl.filterMoviesByGenres(req.params.sortby,req.params, function (err, movies) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(movies);
            }
        });
    }

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


module.exports = router;