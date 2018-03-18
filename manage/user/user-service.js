var user = require('../../models/user');
var constants = require('../../utils/constants');

var create = (req, res) => {
    var data = req.body;
    user.create(data).then((userData) => {
        if (userData.userStatusCode === '4006') {
            return res.status(400).send({
                code: 4006,
                messagekey: constants.messageKeys.code_4006,
                data: {}
            });
        } else {
            return res.status(200).send({
                code: 2000,
                messagekey: constants.messageKeys.code_2000,
                data: userData
            });
        }
    }, (error) => {
        return res.status(500).send({
            code: 5002,
            messagekey: constants.messageKeys.code_5002,
            data: {}
        });

    });
};

module.exports = {
    create: create
};