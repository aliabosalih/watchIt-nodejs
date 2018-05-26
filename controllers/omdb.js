const ombdKey = "874267eaf5a939d84558ff2a721bbe64"
const omdpApi = "https://api.themoviedb.org/3/"
const imgUrl = "https://image.tmdb.org/t/p/w500"

let mongoDB = require('../MongoDB'),
    https = require('https'),
    movieSchema = mongoDB.mongodb.model('movieSchema');

let genres =
    {
        "28": "Action",
        "12": "Adventure",
        "16": "Animation",
        "35": "Comedy",
        "80": "Crime",
        "99": "Documentary",
        "18": "Drama",
        "10751": "Family",
        "14": "Fantasy",
        "36": "History",
        "27": "Horror",
        "10402": "Music",
        "9648": "Mystery",
        "10749": "Romance",
        "878": "Science Fiction",
        "10770": "TV Movie",
        "53": "Thriller",
        "10752": "War",
        "37": "Western",
        "0": "Drama"
    };

// https://api.themoviedb.org/3/search/movie?query=batman&api_key=874267eaf5a939d84558ff2a721bbe64
exports.getMoviesSchemaFromOmdbJson = function (json) {
    var retArr = []
    let arr = json.results
    arr.forEach(function (value) {
        console.log("value is : ", value);
        let movie = new movieSchema();
        movie.name = value.name;
        movie.description = value.description;
        // movie.runTime = json.Runtime;
        movie.image = value.image;
        movie.language = value.language;
        let genr;
        // if (typeof value.genre_ids[0] == 'object') {
        //     genr = value.genre_ids[0].id;
        //     console.log("genrrrr", genr, value.genre_ids);
        // } else {
        //     if (value.genre_ids.length > 0) {
        //         genr = value.genre_ids[0].toString()
        //     }
        // }
        movie.genre = value.genre // ? genres[genr] : genres["0"];
        movie.released = value.released;
        // movie.imdbRatings = json.imdbRating;
        movie.watchItRating = 0;
        // movie.writer = json.Writer;
        // movie.awards = json.Awards;
        retArr.push(movie);
    });
    return retArr
};


exports.getMoviesFromOmdbJson = function (json) {
    var retArr = []
    let arr = json.results
    arr.forEach(function (value) {
        let movie = {};
        movie.name = value.title;
        movie.description = value.overview;
        // movie.runTime = json.Runtime;
        movie.image = imgUrl + value.poster_path;
        movie.language = value.original_language;
        let genr;
        if (typeof value.genre_ids[0] == 'object') {
            genr = value.genre_ids[0].id;
            console.log("genrrrr", genr, value.genre_ids);
        } else {
            if (value.genre_ids.length > 0) {
                genr = value.genre_ids[0].toString()
            }
        }
        movie.genre = genr ? genres[genr] : genres["0"];
        movie.released = value.release_date;
        // movie.imdbRatings = json.imdbRating;
        movie.watchItRating = 0;
        // movie.writer = json.Writer;
        // movie.awards = json.Awards;
        retArr.push(movie);
    });
    return retArr
};

exports.omdbGetMovieByName = function (name, done) {

    let url = omdpApi + "search/movie?query=" + name.toString() + "&api_key=" + ombdKey;

    let req = https.get(url, function (res) {

        let body = '';
        res.on('data', function (chunk) {

            body += chunk;

        }).on('end', function () {

            let response = JSON.parse(body);
            if (response.Error) {
                console.log('error getting movie from ombd', response.Error);
                done(response.Error, null);
            }
            else {

                let movies = exports.getMoviesFromOmdbJson(response);
                done(null, movies);
            }
        });

    });

    req.on('error', function (err) {

        console.log('error getting movie from omdb', err);
        done(err, null);

    });

};


//         //this url is contain the app id of allmuze
//         let url = "https://graph.facebook.com/oauth/access_token_info?client_id="+allmuze_constans.get("ALLMUZE_APP_ID")+"&access_token="+userData.security.facebook.token;
//         let req = https.get(url, function(res){
//             let body = '';
//             res.on('data', function(chunk){
// body += chunk;
// console.log("body",body);
//             });
//             res.on('end', function(){
//                 let fbResponse = JSON.parse(body);
//                 if(fbResponse.error){

//                     console.log("Error on recieving facebook data : ",fbResponse);
//                     return done(fbResponse);
//                 }
//                 return done(null,fbResponse);
//             });
//         });
//         req.on('error', function(err){
//             console.log("Got an error: ", err);
//             return done(err);
//         });
//         req.end();
//         });
// }


//?t=batman