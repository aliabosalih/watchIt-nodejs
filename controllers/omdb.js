
const ombdKey = "fd5204d0"
const omdpApi =  "http://www.omdbapi.com"

let mongoDB = require('../MongoDB'),
	http = require('http'),
    movieSchema = mongoDB.mongodb.model('movieSchema');



exports.omdbGetMovieByName = function(name , done) {

	let url = omdpApi + "/?apikey=" + ombdKey + "&t=" + name.toString();

	let req = http.get(url , function(res) {

        let body = '';
		res.on('data' , function(chunk) {

               body += chunk;
               
        }).on('end'  , function(){

        	let response = JSON.parse(body);
        	if (response.Error)
        	{
        		console.log('error getting movie from ombd' , response.Error);
        		done(null , response.Error);
        	}
        	else
        	{
        		done()
        	}
        });

	});

	req.on('error' , function(err){

		console.log('error getting movie from omdb' , err);
		done(null , err);

	});
	
};


let getMoviewSchemaFromOmdbJson = function(json) {

	    let movie = new movieSchema();
	    movie.name = json.Title;
	    movie.description = json.Plot;
	    movie.runTime = json.Runtime;
	    movie.image = json.Poster;
	    movie.language = json.Language;
	    movie.genre = json.Genre;
	    movie.released = json.Released;
	    movie.imdbRatings = json.imdbRating;
	    movie.watchitRatings = 0;
	    movie.writer = json.Writer;
	    movie.awards = json.Awards;

	    return movie;
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