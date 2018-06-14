'use strict';
const express = require('express'),
    router = express.Router(),
    moviesCtrl = require('../controllers/movie'),
    fcmCtrl = require('../controllers/fcm'),
    omdbCtrl = require('../controllers/omdb'),
    HashMap = require('hashmap').HashMap;
let mongoDB = require('../MongoDB'),
    fcmTokens = mongoDB.mongodb.model('userFcmTokenSchema');

router.post('/userToken', function (req, res) {
        let userT = new fcmTokens;
        userT.userId = req.body.userId;
        userT.fcmToken = req.body.userToken;
        console.log("------------- ",req.body)
        userT.save(function (err, user) {
            if (err) {
                console.log("err .... ",err)

                res.status(400).json(err);
            } else {
                console.log(">>>>>>>>>>>>>>>>>",user)

                res.status(200).json(user);
            }
        });
    });


router.get('/notificationTest', function (req, res) {
    fcmCtrl.sendMessage()
    fcmCtrl.sendMessage1()
    res.status(200).json({success:true});

});
module.exports = router;

