var q = require('q');
var util = require('util');
var logger = require('../utils/logger');
var sqldb = require('../utils/sqldb');
var constants = require('../utils/constants');

var testing = () => { };

testing.get = () => {
    return q.Promise((resolve, reject) => {
        var query = "select * from application_user";
        sqldb.query(query).then((info) => {
            resolve(info);
        }, (error) => {
            reject(error);
        });
    });
};

module.exports = testing;