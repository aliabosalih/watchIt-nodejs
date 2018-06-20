let mongoDB = require('../MongoDB'),
    conversationSchema = mongoDB.mongodb.model('conversationSchema');


exports.getUsersConversations = function (userId, done) {
    let chaters = [];
console.log(userId)
    conversationSchema.find({
            $or:
                [{"user1.userId": userId.toString()}, {"user2.userId": userId.toString()}]
        }
    ).lean().exec(function (err, docs) {
        if (err) {
            return done(err)
        } else {
            console.log(docs)
            for (let k = 0; k < docs.length; k++) {
                if (docs[k].user1.userId == userId) {
                    chaters.push(docs[k].user2)
                } else {
                    chaters.push(docs[k].user1)
                }
            }
            return done(null,chaters);
        }
    });
};


exports.addConversation = function (user1, user2, done) {


}