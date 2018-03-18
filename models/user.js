var moment = require('moment');
var q = require('q');
var util = require('util');
var bcrypt = require('bcrypt');
var logger = require('../utils/logger');
var db = require('../utils/db');
var constants = require('../utils/constants');
var encryption = require('../utils/encryption');

var user = () => { };

user.findOne = (email) => {
    return q.Promise((resolve, reject) => {
        var key = constants.keys.login + encryption.getEmailHash(email.toLowerCase());
        db.getDocument(key).then((loginDoc) => {
            if (loginDoc.IsDeleted != true) {
                var userKey = constants.keys.user + loginDoc.uniqueKey;
                db.getDocument(userKey).then((userDoc) => {
                    if (userDoc.IsDeleted != true) {
                        resolve(userDoc);
                    } else {
                        reject(new Error("Sorry user Is Deleted"));
                    }
                })
            }
            else {
                reject(new Error("Sorry user Is Deleted"));
            }
        }, (error) => {
            reject(error);
        });
    });
};

user.create = (aUser) => {
    return q.Promise((resolve, reject) => {
        user.findOne(aUser.email).then((userDoc) => {
            // if (aUser.IsRegisgrationCompleted != undefined && aUser.IsRegisgrationCompleted === true) {
            userDoc.userStatusCode = constants.userStatusCode.code_4006;
            //}
            //Code Here if user is registered From web or android
            resolve(userDoc);
        }, (error) => {
            aUser.email = aUser.email.toLowerCase();
            aUser.EmailSalt = encryption.getEmailHash(aUser.email);
            var value = encryption.getEncryptedpasswordWithSalt(aUser.password);
            delete aUser.password;
            aUser.password = value.password;
            aUser.EncryptedPassword = value.password;
            aUser.salt = value.salt;
            aUser.uniqueKey = db.getNextKey();
            var key = constants.keys.user + aUser.uniqueKey;
            aUser.createdDate = moment().utc().format();
            aUser.GlobalTime = moment().utc().format();
            aUser.IsDeleted = false;
            aUser.Type = "User";
            aUser.userStatusCode = constants.userStatusCode.code_4009;
            db.addDocument(key, aUser).then((userDoc) => {
                logger.info(util.format("User Added Successfully With Key %s", key));
                var loginKey = constants.keys.login + encryption.getEmailHash(aUser.email.toLowerCase());
                var loginDoc = {
                    email: aUser.email,
                    uniqueKey: aUser.uniqueKey,
                    IsDeleted: false
                };
                db.addDocument(loginKey, loginDoc).then((status) => {
                    logger.info(util.format("User Added Successfully With Key %s", loginKey));
                    resolve(aUser);
                }, (error) => {
                    logger.info(util.format("Error while adding login document %j", error));
                    reject(error);
                })
            }, (error) => {
                logger.info(util.format("Error While adding user document: %j", error));
                reject(error);
            });
        });
    });
};

user.authenticate = (email, password) => {
    return q.Promise((resolve, reject) => {
        logger.info(util.format("User Authenticate Email %s", email));
        user.findOne(email).then((aUser) => {
            var emailSalt = encryption.getEmailHash(email.toLowerCase());
            aUser.emailSalt = emailSalt;
            var salt = aUser.salt;
            var hashWithsalt = bcrypt.hashSync(password, salt);
            var hash = hashWithsalt.substring(29);
            if (hash === aUser.password) {
                aUser.IsValidUser = true;
                aUser.UserAccessToken = db.getNextKey();
                aUser.sendMaxPasswordAttemptFailed = false;
                logger.debug("Validating Login Response");
                aUser.IsEmailAlreadyExists = true;
                aUser.UserStatus = constants.userStatus.VALID;
                resolve(aUser);
            } else {
                aUser.IsValidUser = false;
                aUser.UserStatus = constants.userStatus.INVALID;
                aUser.IsEmailAlreadyExists = true;
                resolve(aUser);
            }
        }, (error) => {
            logger.info(util.format("Error While fetching User Document %j", error));
            reject(error);
        });
    });
};

user.updateUser = (aUser) => {
    return q.Promise((resolve, reject) => {

    });
};

user.login = (aUser) => {
    return q.Promise((resolve, reject) => {
        var key = constants.keys.accesstoken + aUser.UserAccessToken;
        db.addDocumentWithTtl(key, aUser).then((status) => {
            logger.info(util.format("User Access Token Created Successfully With Key %s", key));
            resolve(aUser);
        }, (error) => {
            reject(error);
        });
    });
};

user.addLoginHistory = (aUser) => {
    return q.Promise((resolve, reject) => {
        var key = constants.keys.loginhistory + aUser.emailSalt;
        var loginObj = {};
        loginObj.AuthID = aUser.emailSalt;
        loginObj.LastLoginHID = aUser.emailSalt;
        loginObj.emailSalt = aUser.emailSalt;
        loginObj.email = aUser.email;
        loginObj.UserAccessToken = aUser.UserAccessToken;
        loginObj.SessionId = aUser.emailSalt;
        loginObj.loginTime = moment().format();
        db.getDocument(key).then((loginHistoryDoc) => {
            loginHistoryDoc.loginHistory[aUser.UserAccessToken] = loginObj;
            db.replaceDocument(key, loginHistoryDoc).then((historyDoc) => {
                logger.info(util.format("Updated login History Document :%s", key));
                resolve(loginObj);
            }, (error) => {
                reject(error);
            })
        }, (error) => {
            if (error.code === 13) {
                var historyObj = {};
                historyObj.loginHistory = {};
                historyObj.loginHistory[aUser.UserAccessToken] = loginObj;
                db.addDocument(key, historyObj).then((historyDoc) => {
                    logger.info(util.format("Login History Document Added Successfully : %s", key));
                    resolve(historyObj);
                }, (error) => {
                    reject(error);
                });
            }
            else {
                reject(error);
            }
        });
    });
};

user.logout = () => {
    return q.Promise((resolve, reject) => {
        updateUserLoginHistory(auserData).then((historyDoc) => {
            resolve(historyDoc);
        }, (error) => {

        });
    });
};

var updateUserLoginHistory = (userData) => {
    return q.Promise((resolve, reject) => {
        var key = constants.keys.loginhistory + userData.emailSalt;
        db.getDocument(key).then((loginDoc) => {
            var emailKeys = _.keys(loginDoc.loginHistory);
            var isDocExixts
        });
    });
};

module.exports = user;