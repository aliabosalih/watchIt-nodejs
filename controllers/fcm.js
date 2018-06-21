'use strict';

const admin = require("firebase-admin");
var serviceAccount = require('../watchit-1948a-firebase-adminsdk-uhyor-bc171421bb');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://watchit-1948a.firebaseio.com'
});

/**
 * generate a notification key for userId and his regTokensArr ,to use in send to group
 * @param userId
 * @param regTokensArr
 * @returns {{operation: string, notification_key_name: string, registration_ids: *}}
 */
const generateNotificationKey = function(userId,regTokensArr){
    // https://android.googleapis.com/gcm/notification
    // Content-Type:application/json
    // Authorization:key=API_KEY
    // project_id:SENDER_ID
    let notification_key = {
        "operation": "create",
        "notification_key_name": userId.toString(),
        "registration_ids":regTokensArr
    }
    return notification_key;
}

/**
 * send a notification to users registration tokens
 */
const sentGroupMessage = function(notificationKey){
    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
    var payload = {
        data: {
            score: "850",
            time: "2:45"
        }
    };
    // Send a message to the device group corresponding to the provided
    // notification key.
    admin.messaging().sendToDeviceGroup(notificationKey, payload)
        .then(function(response) {
            // See the MessagingDeviceGroupResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
}

const sendNotification = function(notificationBody,registrationTokenArr){
     registrationTokenArr = "djFhJDpIhyw:APA91bH_lm8G1LMSH1x_fSXk8CmlQvhPvfSdjTKVOoatBtdzQR2cnOI2dCe1AcH7OYW5hASfg90c9ZOjIoAUXXUhyaHmTL4HwPBI4QF0SNbUeQQeK-6iRO4nXefdqqPrci11SVNmqSnWRW1UN5u47sli7FJy7NzAeQ"
// This registration token comes from the client FCM SDKs.
    //var registrationToken = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";
// See the "Defining the message payload" section below for details
// on how to define a message payload.
    notificationBody = {
        title: 'new comments',
        body:   ' reviewd your movie! take a look'
    };

     let data1 = {
         "_id": "5b0b25fa3a16bd60f3cf1ac0",
         "name": "The Shadow",
         "description": "Based on the 1930's comic strip, puts the hero up against his arch enemy, Shiwan Khan, who plans to take over the world by holding a city to ransom using an atom bomb. Using his powers of invisibility and \"The power to cloud men's minds\", the Shadow comes blazing to the city's rescue with explosive results.",
         "image": "https://image.tmdb.org/t/p/w500/uk2DdXqdGiFfF5PrvvadQHKES1o.jpg",
         "language": "en",
         "genre": "Adventure",
         "watchItRating": 4.333333333333333,
         "ratersCounter": 3,
         "ratersSum": 13,
         "trailer": "8LYIcXs4HV0",
         "__v": 0
     };
     let dataSend = JSON.stringify(data1);
    var payload = {
        notification:notificationBody ,
        data: {
            movie :"5b0b25fa3a16bd60f3cf1ac0"
        },

        token : registrationTokenArr
    };
// Send a message to the device corresponding to the provided
// registration token.
    admin.messaging().send(payload)
        .then(function(response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
};

const sendMessage = function(){
  let  registrationTokenArr = "fSOCM4ubGMY:APA91bFPNzvD2bWCsQcfti4DsRh8Gc_e5Jkqdp2bLk9fefPrrsv5jaBzCRg5BEjX8FUiKaiegVf_NXNOSJ2Hu5Fmkv-w-rNopq2yhM6vW4TUAyN59rhWrMUfj6RL8K1j67oIdD5YGL2v"
// This registration token comes from the client FCM SDKs.
    //var registrationToken = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
    var payload = {
        data: {
            score: "850",
            time: "2:45"
        },
        notification: {
            title: 'first notification',
            body: ' gained 11.80 points to close at 835.67, up 1.43% on the day.'
        }
    };

// Send a message to the device corresponding to the provided
// registration token.
    admin.messaging().sendToDevice(registrationTokenArr, payload)
        .then(function(response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });

};

/** api side
 * send to a user registration tokens a notification
 * @param userGroup
 */
function sendGroupMessage(userId,notificationKey){
    userFcmReg.findOne({userId:userId}).exec(function(err,data){
        if(err || !data){
            return done(err || 'not found');
        }else{
            let notificationKey = generateNotificationKey(userId,data.fcmDevicesToken);
            sentGroupMessage(notificationKey);
        }
    });
}


/**
 * send to a user registration tokens a notification
 * @param userGroup
 */
function sendToGroupWithNotifKey(notificationKey) {
    sentGroupMessage(notificationKey);
}

/**
 * get the registration tokens for the user
 * @param user
 * @param body
 * @param done
 * @returns {*}
 */
function getUserRegTokens(user,done){
    if(!user){
        return done("USER NOT FOUND");
    }else {
        userFcmReg.findOne({userId:user._id}).exec(function(err,data){
            if(err || !data){
                return done(err || 'not found');
            }
            return done(data.fcmDevicesToken);
        });
    }
}


/**
 * add a device registration token for user
 * @param user
 * @param body
 * @param done
 * @returns {*}
 */
function addDeviceRegToken(user,body,done){
    if(!user || !body || body.fcmToken === ""){
        return done("USER NOT FOUND");
    }else {
        let fcmToken = body.fcmToken;
        userFcmReg.findOneAndUpdate({userId:user._id},{$push:{"fcmDevicesToken":fcmToken.toString()}}, { upsert: true, 'new': true }).exec(function(err,data){
            if(err || !data){
                return done(err || 'not found');
            }
            return done(null);

        });
    }
}

/**
 * remove for the current user the registration token for specific device
 * @param user
 * @param body
 * @param done
 * @returns {*}
 */
function removeDeviceRegToken(user,body,done){
    if(!user || !body || body.fcmToken === ""){
        return done("USER NOT FOUND");
    }else {
        let fcmToken = body.fcmToken;
        userFcmReg.findOneAndUpdate({userId:user._id},{$pull:{"fcmDevicesToken":fcmToken.toString()}}, {'new': true}).exec(function(err,data){
            if(err || !data){
                return done(err || 'not found');
            }
            return done(null);

        });
    }
}
exports.sendToGroupWithNotifKey = sendToGroupWithNotifKey;
exports.sendMessage = sendMessage;
exports.sendNotification = sendNotification;
exports.getUserRegTokens = getUserRegTokens;
exports.sendGroupMessage = sendGroupMessage;
exports.removeDeviceRegToken = removeDeviceRegToken;
exports.addDeviceRegToken = addDeviceRegToken;