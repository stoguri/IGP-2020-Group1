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
app.get('/auth/check', (req, res) => {
    if(req.session.auth) {
        res.sendStatus(204);
    } else {
        res.sendStatus(403);
    }
});

// %%% API routes and functions %%%

// DB functions
const db = require('./db/main.js');

/**
 * @api {post} /api/vehicle record new vehicle
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {identifier} identifier of new vehicle
 * @apiParam {integer} id of entrance
 * @apiParam {time} time of entrance
 *
 * @apiSuccess {status} 202
 * @apiFailure {status} 500
 */
app.post('/api/vehicle', async (req, res) => {
    const status = await db.newVehicle(req.query.identifier, 
        req.query.id, req.query.time);
    res.sendStatus(status);
});

/**
 * @api {post} /api/vehicle record new vehicle
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {identifier} identifier of existing vehicle
 * @apiParam {integer} id of exit
 * @apiParam {time} time of exit
 *
 * @apiSuccess {status} 202
 * @apiFailure {status} 500
 */
app.put('/api/vehicle/exit', async (req, res) => {
    const status = await db.updateVehicle(req.query.identifier,
        req.query.id, req.query.time);
    res.sendStatus(status);
});

// %%% demo and debug functions %%%
app.get('/debug/test', (req, res) => {
    res.json({"field1": "value1", "field2": "value2"});
});

app.get("demo/rgbToHex", function(req, res) {
    const red   = parseInt(req.query.red, 10);
    const green = parseInt(req.query.green, 10);
    const blue  = parseInt(req.query.blue, 10);
    const hex = converter.rgbToHex(red, green, blue);
    res.send(hex);
});
  
app.get("demo/hexToRgb", function(req, res) {
    const hex = req.query.hex;
    const rgb = converter.hexToRgb(hex);
    res.send(JSON.stringify(rgb));
});

// same as functions from clientside test
function rgbToHex(red, green, blue) {
    const redHex   = red.toString(16);
    const greenHex = green.toString(16);
    const blueHex  = blue.toString(16);
  
    return pad(redHex) + pad(greenHex) + pad(blueHex);
  };
  
function pad(hex) {
    return (hex.length === 1 ? "0" + hex : hex);
}

function hexToRgb(hex) {
    const red   = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue  = parseInt(hex.substring(4, 6), 16);

    return [red, green, blue];
};