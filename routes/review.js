const express = require('express'),
    router = express.Router();

let reviewsCtrl = require('../controllers/review');

/**
 * body : {
    "movieId": Schema.ObjectId,
    "userId": Schema.ObjectId,
    "comment": String,
    "user": {
        "name": String,
        "age": Number,
        "facebookId": String,
        "image": String
    },
    "rate": Number
    }
 */
router.post('', function (req, res) {
    console.log("add Review",req.body);
    reviewsCtrl.addReview(req.body,function (err, comment) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(comment);
        }
    });

})