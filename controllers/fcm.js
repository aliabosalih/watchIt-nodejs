'use strict';

const admin = require("firebase-admin");
var serviceAccount = require('./watchit-1948a-firebase-adminsdk-uhyor-f18fe4c300');

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

const sendMessage = function(registrationTokenArr){

// This registration token comes from the client FCM SDKs.
    //var registrationToken = "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
    var payload = {
        data: {
            score: "850",
            time: "2:45"
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
exports.getUserRegTokens = getUserRegTokens;
exports.sendGroupMessage = sendGroupMessage;
exports.removeDeviceRegToken = removeDeviceRegToken;
exports.addDeviceRegToken = addDeviceRegToken;