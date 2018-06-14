'use strict';
const express = require('express') ,
    app = express(),
    compression = require('compression'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    usersRoute = require('./routes/user'),
    movieRoute = require('./routes/movie'),
    reviewsRoute = require('./routes/review'),
    fcmRoute = require('./routes/fcm');

app.use(morgan('combined'));
app.use(compression());
app.use(bodyParser.json({defer: true, limit: '50mb'}));




app.use('/users' , usersRoute);
app.use('/movies' , movieRoute);
app.use('/fcm' , fcmRoute);
app.use('/reviews' , reviewsRoute);
app.use('/fcm' , fcmRoute);

let port = process.env.PORT;
console.log("............",port);

app.listen(8081 , function(){

    console.log("sucess");

});









