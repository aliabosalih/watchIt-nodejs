let mongoDB = require('../MongoDB'),
    conversationSchema = mongoDB.mongodb.model('conversationSchema');

let User = mongoDB.mongodb.model('userSchema');
let fcmCtrl = require('../controllers/fcm');
let tokens = mongoDB.mongodb.model('userFcmTokenSchema');


exports.addConversation = function (user1, user2, done) {
    conversationSchema.findOne({
        $or: [{
            "user1._id": user1.toString(),
            "user2._id": user2.toString()
        }, {"user1._id": user2.toString(), "user2._id": user1.toString()}]
    }).lean().exec(function (err, conver) {
        if (err) {
            console.log("here 1");
            return done(err)
        } else {
            if (!conver) {
                User.findOne({_id: user1}).lean().exec(function (err, doc1) {
                    if (err) {
                        console.log("here 2")
                        return done(err)
                    } else {
                        console.log(doc1)
                        User.findOne({_id: user2}).lean().exec(function (err, doc2) {
                            if (err) {
                                console.log("here 3")
                                return done(err)
                            } else {
                                console.log(">>>", doc2)
                                let u = new conversationSchema();
                                let user1doc = {
                                    "facebookId": doc1.facebookId,
                                    "name": doc1.name,
                                    "_id": doc1._id,
                                    "image": doc1.image
                                };
                                let user2doc = {
                                    "facebookId": doc2.facebookId,
                                    "name": doc2.name,
                                    "_id": doc2._id,
                                    "image": doc2.image
                                };
                                u["user1"] = JSON.parse(JSON.stringify(user1doc));
                                u["user2"] = JSON.parse(JSON.stringify(user2doc));
                                // u["user2"] = user2doc;
                                u["name"] = user1.toString() + "|" + user2.toString();
                                u["msgCounter"] = 0;
                                u.save(function (err, succ) {
                                    if (err) {
                                        console.log("here 4")
                                        return done(err)
                                    } else {
                                        let uu = {};
                                        uu["isNew"] = true;
                                        uu["name"] = succ.name;
                                        uu["msgCounter"] = succ.msgCounter;
                                        uu["user"] = JSON.parse(JSON.stringify(user2doc));
                                        uu["messages"] = [{id: user2doc, "text": "Bye"}];
                                        return done(null, uu);
                                    }
                                })
                            }
                        });
                    }
                });
            } else {
                let result = {};
                if (conver.user1._id == user1) {
                    result["user"] = conver.user2;
                    result["msgCounter"] = conver.msgCounter;
                    result["messages"] = [{id: user1, "text": "Hi"}];
                    result["name"] = conver.name;
                    result["isNew"] = false;
                    console.log("conversation is ++++++++++++++++ ",result)
                    return done(null, result)
                } else {
                    result["user"] = conver.user1;
                    result["msgCounter"] = conver.msgCounter;
                    result["messages"] = [{id: user1, "text": "Hi"}];
                    result["name"] = conver.name;
                    result["isNew"] = false;
                    console.log("conversation is ++++++++++++++++ ",result)
                    return done(null, result)
                }
            }
        }
    });
}

exports.chatSendNotification = function (msg, user1, user2, done) {
    console.log("------------------- ", user1, "......................", user2);
    let user1Token = undefined;
    let user2Token = undefined;
    conversationSchema.findOneAndUpdate({$or:[{"user1._id": user1, "user2._id": user2},{"user1._id": user2, "user2._id": user1}]},{$inc:{"msgCounter":1}}).lean().exec(function (err, chat12) {
        if(err){
            return done(err);
        }else{
            User.findOne({_id: user1}).lean().exec(function (err, userDoc) {
                if (err) {
                    return done(err);
                } else {
                    let u = {};

                    let uu = {
                        "facebookId": userDoc.facebookId,
                        "name": userDoc.name,
                        "_id": userDoc._id,
                        "image": userDoc.image
                    };

                    u["user"] = uu;
                    u["name"] = user1.toString() + "|" + user2.toString();
                    tokens.findOne({userId: user2}).lean().exec(function (err, tokenUser2) {
                        if (err) {
                            return done(err);
                        } else {
                            user2Token = tokenUser2.fcmToken;
                            let notificationBody = {
                                title: userDoc.name.toString() + 'new message',
                                body: msg.toString(),
                            };
                            console.log("--------------------------- ", user2Token)
                            fcmCtrl.chatNotification(u, notificationBody, user2Token);
                            return done();
                        }
                    });
                }
            });
        }

    });
}


exports.chatSendNotificationAndAddconversation = function (msg, user1, user2, done) {
    conversationSchema.findOne({
        $or: [{
            "user1._id": user1.toString(),
            "user2._id": user2.toString()
        }, {"user1._id": user2.toString(), "user2._id": user1.toString()}]
    }).lean().exec(function (err, conversation) {
        if (err) {
            return done(err);
        } else {
            exports.addConversation(user1, user2, function (err, conv) {
                console.log("------------------- ", user1, "......................", user2);
                let user1Token = undefined;
                let user2Token = undefined;
                User.findOne({_id: user1}).lean().exec(function (err, userDoc) {
                    if (err) {
                        return done(err);
                    } else {
                        let u = {};
                        let uu = {
                            "facebookId": userDoc.facebookId,
                            "name": userDoc.name,
                            "_id": userDoc._id,
                            "image": userDoc.image
                        };

                        u["user"] = uu;
                        u["name"] = user1.toString() + "|" + user2.toString();
                        tokens.findOne({userId: user2}).lean().exec(function (err, tokenUser2) {
                            if (err) {
                                return done(err);
                            } else {
                                user2Token = tokenUser2.fcmToken;
                                let notificationBody = {
                                    title: userDoc.name.toString() + 'new message',
                                    body: msg.toString(),
                                };
                                console.log("--------------------------- ", user2Token)
                                fcmCtrl.chatNotification(u, notificationBody, user2Token);
                                if (!conversation) {
                                    return done(null, conv);
                                } else {
                                    return done();
                                }
                            }
                        });
                    }
                });
            });

        }
    })


}
exports.getUsersConversations = function (userId, done) {
    let chaters = [];
    console.log(userId)

    conversationSchema.find({"user1._id": userId.toString(),"msgCounter":{$gt:0}}).lean().exec(function (err, docs1) {
        if (err) {
            return done(err)
        } else {
            conversationSchema.find({"user2._id": userId.toString(),"msgCounter":{$gt:0}}).lean().exec(function (err, docs2) {
                if (err) {
                    return done(err)
                } else {
                    for (let k = 0; k < docs1.length; k++) {
                        let u = {};
                        u["user"] = docs1[k].user2;
                        u["messages"] = [];
                        u["messages"] = [{id: docs1[k].user2._id, "text": "Bye"}];
                        u["name"] = docs1[k].name;
                        chaters.push(u)
                    }
                    for (let i = 0; i < docs2.length; i++) {
                        let u = {};
                        u["user"] = docs2[i].user1;
                        u["messages"] = [];
                        u["name"] = docs2[i].name;
                        chaters.push(u)
                    }
                    return done(null, chaters);
                }
            });
        }
    });
};
