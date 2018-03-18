var bcrypt = require('bcrypt');
var config = require('../config');
var crypto = require('crypto');

var getEmailHash = (email) => {
    var exp = RegExp('/', 'g');
    var emailHashWithSalt = bcrypt.hashSync(email, config.get('server.security.emailSalt'));
    var emailHash = emailHashWithSalt.substring(29);
    return emailHash;
};

var getEncryptedpasswordWithSalt = (password) => {
    var salt = bcrypt.genSaltSync(10);
    var passwordHashWithSalt = bcrypt.hashSync(password, salt);
    var passwordHash = passwordHashWithSalt.substring(29);
    return {
        password: passwordHash,
        salt: salt
    }
};

module.exports = {
    getEmailHash: getEmailHash,
    getEncryptedpasswordWithSalt: getEncryptedpasswordWithSalt
};