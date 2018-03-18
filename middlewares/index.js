var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var config = require('../config');
module.exports = function (app) {
    // Eanble CORS support
    if (config.get('server.security.enableCORS'))
        require('./CORS')(app);


    app.use(bodyparser.urlencoded({
        extended: true,
        limit: config.get('server.bodyParser.limit')
    }));
    app.use(bodyparser.json({
        limit: config.get('server.bodyParser.limit')
    }));
    app.use(cookieparser('server.session.cookiesecret'))


    if (config.get('server.enableSessionCouchbase'))
        require('./couchbaseSession')(app);

    if (config.get('server.enablePassportAuthentication'))
        require('./passport')(app);

    // Enable CSRF token security
    if(config.get('server.enableCSRFSecurity'))
    require('./CSRF')(app);


};