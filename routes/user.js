const express = require('express'),
    router = express.Router(),
    userCtrler = require('../controllers/user');


router.post('/signIn', function (req, res) {
    console.log('the request ', req.body);
    userCtrler.getUserByFacebookId(req.body.facebookId, function (err, user) {
        if (err) 
        {
            res.status(500).json(err);
        }
        else 
        {
            if (user) // user already exists
            {
                res.status(200).json(user);
            }
            else // create new user
            {
                userCtrler.createUser(req.body, function (err, user) {

                    if (err) {
                        res.status(500).json(err);
                    }
                    else {
                        res.status(200).json(user);
                    }

                });
            }
        }

    });

});

router.get('/user/:userId', function (req, res) {
    userCtrler.getUserById(req.params.userId.toString(),function (err,user) {
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(user);
        }
    });
});



module.exports = router;


