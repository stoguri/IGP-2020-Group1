'use strict';

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('./config');

passport.serializeUser(function(user, done) {
        done(null, user);
    }
);

passport.deserializeUser(function(user, done) {
        done(null, user);
    }
);

passport.use(new Auth0Strategy(
    {
        domain: config.auth.domain,
        clientID: config.auth.clientID,
        clientSecret: config.auth.clientSecret,
        callbackURL: `http://${config.network.domain}:${config.network.port}/auth/callback`
    }, 
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
));