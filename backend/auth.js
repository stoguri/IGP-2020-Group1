'use strict';

const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const crypto = require('crypto');

const config = require('./config.json');
let users_headless = require('./users.json').users_headless;

if(config.operationMode == "test") {
    const testData = require('./db/testData.json');
    users_headless = users_headless.concat(testData.users);
}

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
        callbackURL: `http://${config.network.domain}:8080/auth/callback`
    }, 
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }
));

/**
 * Checks if authentication details given match an entry in headlessUsers.json
 * @param {string} username 
 * @param {string} password encrypted using encryption method specified in config.json
 * @returns {status}
 */
module.exports.headlessLogin = function(username, password) {
    // check if username exists
    function getUser(username) {
        for(const user of users_headless) {
            if(username == user.id) {
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
    const hash = crypto.createHash(config.auth.encryptionMethod);
    hash.update(user.password);

    if(hash.digest('hex') == password) {
        return 204;
    } else {
        // passwords do not match
        return 401;
    }
}