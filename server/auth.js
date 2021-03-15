'use strict';

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const crypto = require('crypto');

const config = require('./config');
const headlessUsers = require('./headlessUsers.json');

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

/**
 * Checks if authentication details given match an entry in headlessUsers.json
 * @param {string} username 
 * @param {string} password encrypted 
 * @returns {status}
 */
module.exports.headlessLogin = function(username, password) {
    // check if username exists
    function getUser(username) {
        for(const user of headlessUsers) {
            if(username == user.username) {
                return user;
            }
        }
        return false;
    }

    const user = getUser(username);
    if(!user) {
        // user with username not found
        return 404;
    }

    // check if password matches
    const hash = crypto.createHash('md5');
    hash.update(user.password);

    if(hash.digest('hex') == password) {
        return 204;
    } else {
        // passwords do not match
        return 401;
    }
}