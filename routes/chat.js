const express = require('express'),
    router = express.Router(),
    chatCtrl = require('../controllers/chat');

let mongoDB = require('../MongoDB');

router.get('/getUserConversations/:userId', function (req, res) {
    chatCtrl.getUsersConversations(req.params.userId, function (err, conversations) {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(conversations);
        }
    })
});


router.post('/addConversation', function (req, res) {
console.log("+++++++++++++++++++ ",req.body.user1,  "))))))))))))))))" ,req.body.user2)
    chatCtrl.addConversation(req.body.user1, req.body.user2, function (err , conversation) {
        if (err) {
            console.log(err)
            res.status(500).json(err);
        }
        else {
            res.status(200).json(conversation);
        }
    })
});


let chats = mongoDB.mongodb.model('conversationSchema');
router.post('/buildConv', function (req, res) {
    let chat1 = new chats();
    chat1.user1 = {
        "name": "Muhammad Raziq",
        "facebookId": "10156351469232902",
        "image": "https://lookaside.facebook.com/platform/profilepic/?asid=10156351469232902&height=50&width=50&ext=1527723271&hash=AeSZeVpPBbH9hLxk",
        "userId": "5b0b4088793b5371e269e975"
    };
    chat1.user2 = {
        "name": "Ali Abo Salih",
        "facebookId": "10217177314324508",
        "image": "https://lookaside.facebook.com/platform/profilepic/?asid=10217177314324508&height=50&width=50&ext=1527718024&hash=AeQpVrxt5RL6hUFi",
        "userId": "5b0b2c09b5f8aa69bd3336f7"
    };
    chat1.save(function(err,chatt){
        if(err){
            res.status(500).json(err);
        }else{
            res.status(200).json(chatt);
        }
    })
});

module.exports = router;
