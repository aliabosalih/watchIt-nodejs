
const ombdKey = "874267eaf5a939d84558ff2a721bbe64"
const omdpApi =  "https://api.themoviedb.org/3/"
const imgUrl = "https://image.tmdb.org/t/p/w500"

let mongoDB = require('../MongoDB'),
	https = require('https'),
    movieSchema = mongoDB.mongodb.model('movieSchema');


    // https://api.themoviedb.org/3/search/movie?query=batman&api_key=874267eaf5a939d84558ff2a721bbe64



exports.omdbGetMovieByName = function(name , done) {

	let url = omdpApi + "search/movie?query=" + name.toString() + "&api_key=" + ombdKey;

	let req = https.get(url , function(res) {

        let body = '';
		res.on('data' , function(chunk) {

               body += chunk;
               
        }).on('end'  , function(){

        	let response = JSON.parse(body);
        	if (response.Error)
        	{
        		console.log('error getting movie from ombd' , response.Error);
        		done(response.Error , null);
        	}
        	else
        	{

        		let movies = getMoviesSchemaFromOmdbJson(response);
        		done(null , movies);
        	}
        });

	});

	req.on('error' , function(err){

		console.log('error getting movie from omdb' , err);
		done(err , null);

	});
	
};


let getMoviesSchemaFromOmdbJson = function(json) 
{

			var retArr = []
			let arr = json.results

			arr.forEach(function(value){

				console.log("value is : " , value);
				let movie = new movieSchema();

			    movie.name = value.title;
			    movie.description = value.overview;
			    // movie.runTime = json.Runtime;
			    movie.image =  imgUrl + value.poster_path;
			    movie.language = value.original_language;
			    // movie.genre = json.Genre;
			    movie.released = value.release_date;
			    // movie.imdbRatings = json.imdbRating;
			    movie.watchitRatings = 0;
			    // movie.writer = json.Writer;
			    // movie.awards = json.Awards;

			    retArr.push(movie);

			});


		return retArr
	    
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