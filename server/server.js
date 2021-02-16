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

app.get('/login', passport.authenticate('auth0', {
    // define what user info is sent
    scope: 'openid profile',
}))

app.get('/callback', passport.authenticate('auth0'), (req, res) => {
    console.log("callback time");
    req.session.user = req.user;
    res.redirect('/');
});