module.exports = (app) => {
    var passport = require('passport');
    var user = require('../models/user');
    var localStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    var strategy = new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, next) => {
        user.authenticate(email, password).then((user) => {
            next(null, user);
        }, (error) => {
            next(error);
        });
    });

    passport.use(strategy);

    passport.serializeUser((user, next) => {
        next(null, user.UserAccessToken);
    })

    passport.deserializeUser((UserAccessToken, next) => {
        next(null, {});
    });
};