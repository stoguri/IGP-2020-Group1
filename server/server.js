'use strict';

// npm modules
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
// our modules
const db = require('./db/main.js');

const config = require('../client/src/config.json');
// validate config.json

// %%% init server %%%
const app = express();

app.use(cors());

// https server
if(config.network.server.https) {
    const credentials = {
        key: fs.readFileSync(config.network.server.https.key, 'utf8'),
        cert: fs.readFileSync(config.network.server.https.certificate, 'utf8'),
        ca: fs.readFileSync(config.network.server.https.ca, 'utf8')
    }
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(config.network.server.https.port, () => {
        console.log(`HTTPS server running in ${config.operationMode} mode, listening on: ` + 
            `https://${config.network.server.domain}:${config.network.server.https.port}`);
    });
} else {
    // http server
    const httpServer = http.createServer(app);
    httpServer.listen(config.network.server.http.port, () => {
    console.log(`HTTP server running in ${config.operationMode} mode, listening on: ` + 
        `http://${config.network.server.domain}:${config.network.server.http.port}`);
    });
}

app.use('/', express.static('./client/', { 'extensions': ['html'] }));

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
        console.log(req.query);
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
        console.log(req.originalUrl);

        const records = await db.getVehicles(req.query.entrance_id, parseFloat(req.query.entrance_time),
            req.query.exit_id, parseFloat(req.query.exit_time), req.query.inclusive);

        //console.log(records);


        const details = { time: {}, exit: {}, route: {} };

        // construct details array
        // load entrances from config
        // for (const entrance of config.entrances) {
        //     details.entrance[entrance] = 0;
        //     details.exit[entrance] = 0;
        //     // routes
        //     for (const e of config.entrances) {
        //         if (entrance == e) {
        //             continue;
        //         }
        //         details.route[`${entrance}-${e}`] = 0;
        //     }
        // }

        // // derived fields
        // for (const record of records) {
        //     details.entrance[record.entrance_id]++;
        //     if (record.exit_id != null) {
        //         details.exit[record.exit_id]++;
        //         details.route[`${record.entrance_id}-${record.exit_id}`]++;
        //     }
        // }

        for (let i = 0; i < records.length; i++) {
            console.log(records[i]);
            details.time[i] = records[i].entrance_time;
            details.exit[i] = records[i].exit_id;
            details.route[i] = `${records[i].entrance_id} -> ${records[i].exit_id}`;
        }

        res.json(details);
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