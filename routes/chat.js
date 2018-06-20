const express = require('express'),
        router = express.Router(),
        chatCtrl = require('../controllers/chat');


router.get('/chat/getUserConversations/:userId', function (req, res) 
{
    chatCtrl.getUserConversations(req.params.userId , function(err , conversations){

    	if (err) 
    	{
            res.status(500).json(err);
        } 
        else 
        {
            res.status(200).json(conversations);
        }
    })
});


router.post('/chat/addConversation', function (req, res) 
{
    console.log("body in conversation",req.body.name)

    chatCtrl.addConversation(req.body.user1 , req.body.user2 , function(err)
    {
    	if (err) 
    	{
            res.status(500).json(err);
        } 
        else 
        {
            res.status(200).json();
        }
    })
});