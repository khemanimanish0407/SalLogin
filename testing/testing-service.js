var testing = require('./testing-model');
var constants = require('../utils/constants');

var get = (req, res) => {
    testing.get().then((userData) => {
        return res.status(200).send({
            code: 2000,
            messagekey: constants.messageKeys.code_2000,
            data: userData
        });
    }, (error) => {
        return res.status(500).send({
            code: 5002,
            messagekey: constants.messageKeys.code_5002,
            data: {}
        });
    });
};

module.exports = {
    get: get
};