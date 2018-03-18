var q = require('q');
var logger = require('../utils/logger');
var util = require('util');
var constants = require('../utils/constants');
var db = require('../utils/db');
var authenticate = () => { };
authenticate.findOne = (authenticateHeader) => {
    return q.Promise((resolve, reject) => {
        logger.info(authenticateHeader);
        var headerData = authenticateHeader.split('#');
        if (headerData.length === 3) {
            var key = constants.keys.accesstoken + headerData[2];
            db.getDocument(key).then((aUser) => {
                resolve(aUser);
            }, (error) => {
                reject(error);
            })
        } else {
            var error = new Error('Unathorized Access Token');
            reject(error);
        }
    })
};

module.exports = authenticate;