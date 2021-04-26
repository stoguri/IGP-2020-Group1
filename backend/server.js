'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const https = require('https');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const auth = require('./auth.js');
const db = require('./db/main.js');
const config = require('../client/src/config.json');

// verify some config information is correct
// log output for user

const address = config.network.server.protocol + '://' +
    config.network.server.domain + ':' + config.network.server.port;

const clientAddress = config.network.client.protocol + '://' +
    config.network.client.domain + ':' + config.network.client.port;

// set server address as proxy
require('../client/package.json').proxy = address;

// %%% init server %%%
const app = express();

app.use(cors());

if (config.network.server.protocol == 'http') {
    app.listen(config.network.server.port, () => {
        console.log(`Server running in ${config.operationMode} mode, listening on: ${address}`);
    });
} else if (config.network.server.protocol == 'https') {
    https.createServer(app).listen(config.network.server.port);
    console.log(`Server running in ${config.operationMode} mode, listening on: ${address}`);
}

console.log(`Client application running in ${config.operationMode} mode, listening on: ${clientAddress}`);

app.use('/', express.static('./client/', { 'extensions': ['html'] }));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.auth.domain}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: config.auth.api.identifier,
    issuer: [`https://${config.auth.domain}/`],
    algorithms: ['RS256']
});

const checkScopes_basicAdmin = jwtAuthz(['read:vehicle']);
const checkScopes_admin = jwtAuthz(['create:user', 'read:vehicle']);
const checkScopes_writer = jwtAuthz(['create:vehicle']);

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

    if (status.toString()[0] == 2) {
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
    console.log("auth check, session id: " + req.sessionID);
    if (req.session.auth) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
});

// %%% API routes and functions %%%

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
app.post('/api/vehicle', checkJwt, checkScopes_writer, async (req, res) => {
    try {
        const status = await db.newVehicle(req.query.identifier,
            req.query.entrance_id, parseFloat(req.query.entrance_time),
            req.query.exit_id, req.query.exit_time);
        res.sendStatus(status);
    } catch (e) {
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
app.get('/api/vehicle', checkJwt, checkScopes_basicAdmin, async (req, res) => {
    try {
        const records = await db.getVehicles(req.query.entrance_id, parseFloat(req.query.entrance_time),
            req.query.exit_id, parseFloat(req.query.exit_time), req.query.inclusive);

        const details = { entrance: {}, exit: {}, route: {} };
        // construct details array
        // load entrances from config
        for (const entrance of config.entrances) {
            details.entrance[entrance] = 0;
            details.exit[entrance] = 0;
            // routes
            for (const e of config.entrances) {
                if (entrance == e) {
                    continue;
                }
                details.route[`${entrance}-${e}`] = 0;
            }
        }

        // derived fields
        for (const record of records) {
            details.entrance[record.entrance_id]++;
            if (record.exit_id != null) {
                details.exit[record.exit_id]++;
                details.route[`${record.entrance_id}-${record.exit_id}`]++;
            }
        }

        // test data
        const vehicleData = {
            "data": [
                { id: '1', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '2', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '3', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '4', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '5', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '6', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '7', dirIn: 'Camera 2', dirOut: 'camera 4' },
                { id: '8', dirIn: 'Camera 2', dirOut: 'camera 4' },
            ]
        }

        res.json(vehicleData);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

if (config.operationMode == "audit") {
    app.get('/api/vehicle', async (req, res) => {

    })
}

module.exports = app;