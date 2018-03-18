module.exports = (app) => {
    var config = require('../config');
    var logger = require('../utils/logger');
    var session = require('express-session');
    var Couchbasestore = require('connect-couchbase')(session);
    var dbconfig = {
        host: config.get('couchbase.host'),
        bucket: config.get('couchbase.buckets.session').name,
        password: config.get('couchbase.buckets.session').password
    };
    var couchbaseStore = new Couchbasestore(dbconfig);
    couchbaseStore.on('connect', () => {
        logger.debug('Couchbase Session Is Ready For Use');
    });
    couchbaseStore.on('disconnect', () => {
        logger.debug('An Error Occured While Storing couchbase session');
    })
    app.use(session({
        name: config.get('server.session.path'),
        cookie: {
            path: config.get('server.session.path'),
            httpOnly: config.get('server.session.httpOnly'),
            secure: config.get('server.session.secure'),
            maxAge: config.get('server.session.maxAge')
        },
        secret: config.get('server.session.cookieSecret'),
        store: couchbaseStore,
        saveUninitialized: true,
        resave: true,
        proxy: config.get('server.session.proxy'),
        rolling: config.get('server.session.rolling')
    }))
}