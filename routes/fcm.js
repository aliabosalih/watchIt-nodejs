'use strict';
const express = require('express'),
    router = express.Router(),
    moviesCtrl = require('../controllers/movie'),
    omdbCtrl = require('../controllers/omdb'),
    HashMap = require('hashmap').HashMap;
let mongoDB = require('../MongoDB'),
    fcmTokens = mongoDB.mongodb.model('userFcmTokenSchema');

router.post('/userToken', function (req, res) {
    let userT = new fcmTokens;
    userT.userId = req.body.userId;
    userT.fcmToken = req.body.userToken;
    userT.save(function (err, user) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(user);
        }
    });
});
