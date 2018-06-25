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
    console.log("------------- ", req.body)

//     fcmTokens.findOne({userId: req.body.userId}).lean().exec(function (err, tokenDoc) {
//         if (err) {
//             console.log("errrrrrr ", err);
//             res.status(400).json(err);
//         } else {
//             if (!tokenDoc) {
//                 userT.save(function (err, user) {
//                     if (err) {
//                         console.log("err .... ", err)
//
//                         res.status(400).json(err);
//                     } else {
//                         console.log(">>>>>>>>>>>>>>>>>", user)
//
//                         res.status(200).json(user);
//                     }
//                 });
//             } else {
//                 fcmTokens.update({userId: req.body.userId}, {$set: {"fcmToken": req.body.userToken}}, {new: true}).exec(function (err, token) {
//                     if (err) {
//                         console.log("err .... ", err)
//
//                         res.status(400).json(err);
//                     } else {
//                         console.log(">>>>>>>>>>>>>>>>>", token)
//
//                         res.status(200).json(token)
//                     }
//                 })
//             }
//         }
//     })
// });

let uuu = {$set : {"userId":req.body.userId,"fcmToken":req.body.userToken,onOff:1}}
fcmTokens.findOneAndUpdate({userId: req.body.userId}, uuu, {upsert: true}).exec(function (err, token) {
    if (err) {
        console.log("err .... ", err)

        res.status(400).json(err);
    } else {
        console.log(">>>>>>>>>>>>>>>>>", token)

        res.status(200).json(token)
    }
});
});

// });
router.post('/notificationSettings/:state', function (req, res) {
    let uuu = {$set : {onOff: Number(req.params.state)}};
    fcmTokens.findOneAndUpdate({userId: req.body.userId}, uuu).exec(function (err, conversations) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(req.body);
        }
    })
});

router.get('/notificationTest', function (req, res) {
    // fcmCtrl.sendMessage()
    let a, b;
    fcmCtrl.sendNotification(undefined, undefined)
    res.status(200).json({success: true});

});
module.exports = router;

