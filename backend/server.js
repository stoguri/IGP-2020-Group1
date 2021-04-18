'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const config = require('./config.json');

// verify some config information is correct
// log output for user

// %%% init server %%% 

const app = express();

app.use(cors())

const server = app.listen(config.network.port, () => {
    console.log(`Server running is ${config.operationMode} mode, listening on: ` +
        config.network.domain + ':' + config.network.port);
});

// app.all('/*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });

app.use('/', express.static('./client/', {'extensions': ['html']}));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// %%% passport middleware %%%
const auth = require('./auth.js');

app.use(passport.initialize());
app.use(passport.session());

/**
 * Login using auth0 strategy
 */
app.get('/auth/login/auth0', passport.authenticate('auth0', {
        // define what user info is sent
        scope: ['openid', 'profile'],
    }), (req, res) => {
        // handle authentication success/failure here
        res.set(access-control-allow-origin)
        res.redirect("/");
    }
);

app.get('/auth/callback', passport.authenticate('auth0'), (req, res) => {
    req.session.user = req.user;
    req.session.auth = true;
    res.redirect('/');
});

// %%% authentication routes & functions %%%

/**
 * @api {get} /auth/login/headless login for headless applications 
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {string} username
 * @apiParam {string} encrypted password
 *
 * @apiSuccess {status} 200
 * @apiFailure {status} 401, 404
 */
app.get('/auth/login/headless', (req, res) => {
    const status = auth.headlessLogin(req.query.id, req.query.password);

    if(status.toString()[0] == 2) {
        req.session.user = {
            "displayName": req.query.id,
            "id": `headless|${req.query.id}`
        };
        req.session.auth = true;
        res.sendStatus(200);
    } else {
        res.sendStatus(status);
    }    
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.end();
    });
});

/**
 * @api {get} /auth/check check if the user has an authenticated session
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiSuccess {status} 204
 * @apiFailure {status} 401
 */
app.get('/auth/check', (req, res) => {
    console.log("got auth check request");
    if(req.session.auth) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
});

async function getPermissionLevel(req) {
    return await db.getPermissionLevel(req.session.user.id.split("|")[1]);
}

// %%% API routes and functions %%%

// DB functions
const db = require('./db/main.js');

/**
 * @api {post} /api/vehicle record new vehicle
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {identifier} identifier of new vehicle
 * @apiParam {string} id of entrance
 * @apiParam {integer} epoch time - entrance time
 * @apiParam {string} id of exit
 * @apiParam {integer} epoch time - exit time
 *
 * @apiSuccess {status} 202
 * @apiFailure {status} 401, 403, 500
 */
app.post('/api/vehicle', async (req, res) => {
    if(!req.session.auth) {
        res.sendStatus(401);
        return;
    }
    if(!["writer"].includes(await getPermissionLevel(req))) {
        res.sendStatus(403);
        return;
    }

    try {
        const status = await db.newVehicle(req.query.identifier, 
            req.query.entrance_id, parseFloat(req.query.entrance_time),
            req.query.exit_id, req.query.exit_time);
        res.sendStatus(status);
    } catch(e) {
        console.error(e);
        res.sendStatus(500);
    }
});

/**
 * @api {get} /api/vehicle get vehicle record - using filter fields
 * @apiName GetVehicle
 * @apiGroup basic, admin
 * 
 * @apiParam {string} entrance_id
 * @apiParam {integer} entrance_time epoch time
 * @apiParam {string} exit_id
 * @apiParam {integer} exit_time epoch time
 * @apiParam {boolean} inclusive if the times give are inclusive or exclusive
 *
 * @apiSuccess {json} details showing entrance, exit and route data
 * @apiFailure {status} 401, 403, 500
 */
app.get('/api/vehicle', async (req, res) => {
    if(!req.session.auth) {
        res.sendStatus(401);
        return;
    }
    if(!["basic", "admin"].includes(await getPermissionLevel(req))) {
        res.sendStatus(403);
        return;
    }

    try {
        const records = await db.getVehicles(req.query.entrance_id, parseFloat(req.query.entrance_time),
            req.query.exit_id, parseFloat(req.query.exit_time), req.query.inclusive);

        const details = {entrance: {}, exit: {}, route: {}};
        // construct details array
        // load entrances from config
        for(const entrance of config.entrances) {
            details.entrance[entrance] = 0;
            details.exit[entrance] = 0;
            // routes
            for(const e of config.entrances) {
                if(entrance == e) {
                    continue;
                }
                details.route[`${entrance}-${e}`] = 0;
            }
        }

        // derived fields
        for(const record of records) {
            details.entrance[record.entrance_id]++;
            if(record.exit_id != null) {
                details.exit[record.exit_id]++;
                details.route[`${record.entrance_id}-${record.exit_id}`]++;
            }
        }

        res.json(details);
    } catch(e) {   
        console.error(e);
        res.sendStatus(500);
    }
});

if(config.operationMode == "audit") {
    app.get('/api/vehicle', async (req, res) => {
        
    })
}

module.exports = app;