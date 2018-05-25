let mongoDB = require('../MongoDB'),
    userSchema = mongoDB.mongodb.model('userSchema');

const getUserByFacebookId = (id, done) => {

    var query = userSchema.find({'facebookId': id});
    query.exec(function (err, users) {
        if (err) {

            done(err, null);
            console.log("get user error :", err);
        }
        else {
            console.log("retTTTTT users", users);
            done(null, users[0]);
        }
    });
};
const updateUser = (data,done) => {
    userSchema.findOneAndUpdate({"_id" : data._id},{$set :{"genres":data.genres,"name":data.name,"image":data.image}},{new:true}).exec(function (err, user) {
        if (err) {
            if(!user){
                console.log("user doesn't exist", err);
                done("User Not Exists");
            }else{
                console.log("update user error ", err);
                done(err, null);
            }
        } else {
            console.log("created user!", user);
            done(null, user);
        }
    });
};
exports.updateUser = updateUser;

const createUser = (user, done) => {
    let a = new userSchema();
    a.name = user.name;
    a.age = user.age;
    a.facebookId = user.facebookId;
    a.image = user.image;
    a.genres = [];
    //"https://www.telegraph.co.uk/content/dam/science/2017/10/22/TELEMMGLPICT000144108354_trans_NvBQzQNjv4BqZqbNnzMENeQWOPqPMX-4IhRy7TN-7bbEnHI_PZtKCtQ.jpeg?imwidth=450";
    a.save(function (err, user) {
        if (err) {
            console.log("create user error ", err);
            done(err, null);
        } else {
            console.log("created user!", user);
            done(null, user);
        }
    });
}

const getUserById = (userId, done) => {
    userSchema.findOne({'_id': userId}).lean().exec(function (err, user) {
        if (err || !user) {
            done(err || "User Not Found!");
        }
        else {
            done(null, user);
        }
    });
}

exports.getUserById = getUserById;
exports.getUserByFacebookId = getUserByFacebookId;
exports.createUser = createUser;