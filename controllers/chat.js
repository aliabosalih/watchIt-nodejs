let mongoDB = require('../MongoDB'),
    conversationSchema = mongoDB.mongodb.model('conversationSchema');

let User = mongoDB.mongodb.model('userSchema');
exports.getUsersConversations = function (userId, done) {
    let chaters = [];
    console.log(userId)

    conversationSchema.find({"user1._id": userId.toString()}).lean().exec(function (err, docs1) {
        if (err) {
            return done(err)
        } else {
            conversationSchema.find({"user2._id": userId.toString()}).lean().exec(function (err, docs2) {
                if (err) {
                    return done(err)
                } else {
                    for (let k = 0; k < docs1.length; k++) {
                        let u = {};
                        u["user"] = docs1[k].user2;
                        u["messages"] = [];
                        u["messages"] = [{id:docs1[i].user2._id,"text":"Bye"}];
                        u["name"] = docs1[k].name;
                        chaters.push(u)
                    }
                    for (let i = 0; i < docs2.length; i++) {
                        let u = {};
                        u["user"] = docs2[i].user1;
                        u["messages"] = [{id:docs2[i].user1._id,"text":"Hi"}];
                        u["name"] = docs2[i].name;
                        chaters.push(u)
                    }
                    return done(null, chaters);

                }

            });

        }
    });
};


//     conversationSchema.find({
//             $or:
//                 [{"user1._id": userId.toString()}, {"user2._id": userId.toString()}]
//         }
//     ).lean().exec(function (err, docs) {
//         if (err) {
//             return done(err)
//         } else {
//             for (let k = 0; k < docs.length; k++) {
//                 let u = {};
//                 if (docs[k].user1.userId == userId) {
//                     u["user"] = docs[k].user2;
//                     u["messages"]= [];
//                     u["name"]=  docs[k].name;
//                     chaters.push(u)
//                 } else {
//                     u["user"] = docs[k].user1;
//                     u["messages"]= [];
//                     u["name"]=  docs[k].name;
//                     chaters.push(u)
//                 }
//             }
//             return done(null,chaters);
//         }
//     });
// };





exports.addConversation = function (user1, user2, done) {
    User.findOne({_id:user1}).lean().exec(function (err,doc1) {
        if(err){
            return done(err)
        }else{
            console.log(doc1)
            User.findOne({_id:user2}).lean().exec(function (err,doc2) {
                if(err){
                    return done(err)
                }else{
                    let u = new conversationSchema();
                    let user1doc = {"facebookId" : doc1.facebookId,"name":doc1.name,"_id":doc1._id,"image":doc1.image};
                    let user2doc = {"facebookId" : doc2.facebookId,"name":doc2.name,"_id":doc2._id,"image":doc2.image};
                    u["user1"] = JSON.parse(JSON.stringify(user1doc));
                    u["user2"] = JSON.parse(JSON.stringify(user2doc));
                    // u["user2"] = user2doc;
                    u["name"] = user1.toString() + "|" + user2.toString();
                    u.save(function (err,succ) {
                        if(err){
                            return done(err)
                        }else{
                            return done(null,u);
                        }
                    })
                }
            });
        }
    });
}