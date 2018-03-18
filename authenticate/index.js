var service = require('./authenticate-service');
module.exports = function (app) {

    //Sessions Request
    app.get('/auth/session', service.session);

    //Login Request
    app.post('/auth/login', service.login);

    app.post('/auth/insertUserLoginHistory', service.insertUserLoginHistory);

    //Logout Request
    app.post('/auth/logout', service.logout);

};