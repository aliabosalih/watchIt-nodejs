
const express = require('express') , 
    app = express(),
    compression = require('compression'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    usersRoute = require('./routes/user'); 
    movieRoute = require('./routes/movie') ;


app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json({defer: true, limit: '50mb'}));

app.use('/users' , usersRoute);
app.use('/movies' , movieRoute);

let port = process.env.PORT;
console.log("............",port);

app.listen(8081 , function(){

    console.log("sucess");

});









