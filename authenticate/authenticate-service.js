var passport = require('passport');
var constants = require('../utils/constants');
var logger = require('../utils/logger');
var authenticate = require('../authenticate/authenticate-model');
var user = require('../models/user');
var util = require('util');
var _ = require('lodash');
//Session
var session = (req, res) => {
    if (req.isAuthenticated()) {
        user.findOne(req.user.email).then((aUser) => {
            if (!_.isUndefined(aUser.SessionId)) {
                return res.status(200).send({
                    code: 2000,
                    messageKey: constants.messageKeys.code_2000,
                    data: req.user
                });
            } else {
                return res.status(200).send({
                    code: 2002,
                    messageKey: constants.messageKeys.code_2002,
                    data: {}
                });
            }
        }, (error) => {
            return res.status(500).send({
                code: 5002,
                messageKey: constants.messageKeys.code_5002,
                data: {}

            })
        });
    }
    else {
        return res.status(200).send({
            code: 2002,
            messageKey: constants.messageKeys.code_2002,
            data: {}
        });
    }
};

var login = (req, res) => {
    passport.authenticate('local', (error, auser) => {
        if (error && error.code === 4001) {
            return res.status(400).send({
                code: 4001,
                messageKey: constants.messageKeys.code_4001,
                data: {}
            });
        } else if (error) {
            return res.status(500).send({
                code: 5000,
                messageKey: constants.messageKeys.code_5000,
                data: {}
            });
        }
        if (_.isUndefined(auser) || _.isUndefined(auser.IsValidUser) || auser.IsValidUser === false) {
            logger.info(util.format("Logged in failed With %s Email", auser.email));
            return res.status(400).send({
                code: 4001,
                messageKey: constants.messageKeys.code_4001,
                data: {}
            })
        }
        auser.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        auser.userAgent = req.headers['user-agent'];
        user.login(auser).then((result) => {
            logger.info(util.format("Successfully %s email logged In Ip:%s", auser.email, auser.ip));
            req.login(auser, (error) => {
                return res.status(200).send({
                    code: 2003,
                    messageKey: constants.messageKeys.code_2003,
                    data: auser
                })
            });
            delete history.userAgent;
            delete history.SessionId;
        });
    })(req, res);
};

var insertUserLoginHistory = (req, res) => {
    authenticate.findOne(req.headers.authorization).then((aUser) => {
        var data = req.body;
        data.UserAccessToken = aUser.UserAccessToken;
        data.emailSalt = aUser.emailSalt;
        data.email = aUser.email;
        user.addLoginHistory(data).then((historyDoc) => {
            return res.status(200).send({
                code: 2000,
                messageKey: constants.messageKeys.code_2000,
                data: historyDoc
            });
        }, (error) => {
            return res.status(500).send({
                code: 5002,
                messageKey: constants.messageKeys.code_5002,
                data: {}
            });
        });
    }, (error) => {
        return res.status(400).send({
            code: 4004,
            messageKey: constants.messageKeys.code_4004,
            data: {}
        })
    })
};

var logout = (req, res) => {
    authenticate.findOne(req.headers.authorization).then(() => {

    });

};

module.exports = {
    session: session,
    login: login,
    logout: logout,
    insertUserLoginHistory: insertUserLoginHistory
};