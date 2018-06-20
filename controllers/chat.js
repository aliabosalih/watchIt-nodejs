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
            for (let k = 0; k < docs.length; k++) {
                let u = {};
                if (docs[k].user1.userId == userId) {
                    u["user"] = docs[k].user2;
                    chaters.push(u)
                } else {
                    u["user"] = docs[k].user1;
                    chaters.push(u)
                }
            }
            return done(null,chaters);
        }
    });
};


exports.addConversation = function (user1, user2, done) {


}