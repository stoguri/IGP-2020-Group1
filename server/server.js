'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');

// %%% init server %%% 

const app = express();

const config = require('./config');

const server = app.listen(config.network.port, () => {
    console.log('Server listening on:', config.network.domain + ':' + config.network.port);
});

app.use('/', express.static('client', {'extensions': ['html']}));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// %%% passport middleware %%%

require('./auth.js');

app.use(passport.initialize());

app.use(passport.session());

/**
 * Login using auth0 strategy
 */
app.get('/auth/login/auth0', passport.authenticate('auth0', {
        // define what user info is sent
        scope: ['openid', 'profile'],
    }
));

app.get('/auth/callback', passport.authenticate('auth0'), (req, res) => {
    req.session.user = req.user;
    req.session.auth = true;

    console.log(req.session.user.displayName + " authenticated.");

    res.redirect('/');
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
        res.end();
    });
});

// %%% authentication routes & functions %%%

/**
 * check if the user has an authenticated session
 * @response {status}
 */
app.get('/auth/authCheck', (req, res) => {
    if(req.session.auth) {
        res.sendStatus(204);
    } else {
        res.sendStatus(403);
    }
});