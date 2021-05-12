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
const crypto = require('crypto');
// our modules

const config = require('../client/src/config.json');
// validate config.json

// %%% init server %%%
const app = express();

app.use(cors());

let server;
// https server
if(config.network.server.https) {
    const credentials = {
        key: fs.readFileSync(config.network.server.https.key, 'utf8'),
        cert: fs.readFileSync(config.network.server.https.certificate, 'utf8'),
        ca: fs.readFileSync(config.network.server.https.ca, 'utf8')
    }
    server = https.createServer(credentials, app);
    server.listen(config.network.server.https.port, () => {
        console.log(`HTTPS server running in ${config.operationMode} mode, listening on: ` + 
            `https://${config.network.server.domain}:${config.network.server.https.port}`);
    });
} else {
    // http server
    server = http.createServer(app);
    server.listen(config.network.server.http.port, () => {
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
const checkScopes_admin = jwtAuthz(['create:user', 'read:vehicle', 'read:vehicle_audit']);
const checkScopes_writer = jwtAuthz(['create:vehicle']);

// %%% socket framework %%%

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    /*
    io.emit("vehicleDataUpdate", {
        junction_id: 'id0',
        fields: ["Number of cars entered through this camera", "id0->id1"]
    });
    */
})

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

        // send socket messages
        // one for entrance
        io.emit("vehicleDataUpdate", {
            junction_id: req.query.entrance_id,
            fields: ["Number of cars entered through this camera", 
                `${req.query.entrance_id}->${req.query.exit_id}`]
        });
        // one for exit
        io.emit("vehicleDataUpdate", {
            junction_id: req.query.exit_id,
            fields: ["Number of cars exited through this camera", 
                `${req.query.entrance_id}->${req.query.exit_id}`]
        });

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
 * @apiParam {string} entrance_id - vehicles must enter using this entrance
 * @apiParam {string} exit_id - vehicles must exit using this exit
 * @apiParam {string} junction_id - vehicles must use this junction at some point throughout their route
 * @apiParam {integer} entrance_time epoch time
 * @apiParam {integer} exit_time epoch time
 * @apiParam {boolean} inclusive if the times give are inclusive or exclusive
 *
 * @apiSuccess {json} details showing entrance, exit and route data
 * @apiFailure {status} 401, 403, 500
 */
app.get('/api/vehicle', checkJwt, checkScopes_basicAdmin, async (req, res) => {
    try {
        if(req.query.entrance_id && req.query.exit_id) {
            // records using route with entrance and exit
            const records = await db.getVehicleData(req.query.entrance_id, 
                req.query.exit_id, null,
                parseInt(req.query.entrance_time), parseInt(req.query.exit_time),
                req.query.inclusive);

            res.send(records.length);
        } else if(req.query.entrance_id) {
            // records using this junction as entrance
            const records = await db.getVehicleData(req.query.entrance_id, null, null, 
                parseInt(req.query.entrance_time), parseInt(req.query.exit_time),
                req.query.inclusive);
            
            const details = {entrance: records.length, exit: {}, route: {}};

            // construct details array
            // load entrances from config
            for (const exit of config.entrances) {
                details.exit[exit] = 0;
                // routes
                details.route[`${req.query.entrance_id}->${exit}`] = 0;
            }

            for(const record of records) {
                details.exit[record.exit_id]++;
                details.route[`${req.query.entrance_id}->${record.exit_id}`]++;
            }

            res.json(details);
        } else if(req.query.exit_id) {
            // records using this junction as entrance
            const records = await db.getVehicleData(null, req.query.exit_id, null, 
                parseInt(req.query.entrance_time), parseInt(req.query.exit_time),
                req.query.inclusive);
            
            const details = {entrance: {}, exit: records.length, route: {}};

            // construct details array
            // load entrances from config
            for(const entrance of config.entrances) {
                details.entrance[entrance] = 0;
                // routes
                details.route[`${entrance}->${req.query.exit_id}`] = 0;
            }

            for(const record of records) {
                details.entrance[record.entrance_id]++;
                details.route[`${record.entrance_id}->${req.query.exit_id}`]++;
            }

            res.json(details);
        } else if(req.query.junction_id) {
            // records using this junction as entrance or exit 
            const records = await db.getVehicleData(null, null, req.query.junction_id,
                parseInt(req.query.entrance_time), parseInt(req.query.exit_time),
                req.query.inclusive);

            const details = {entrance: 0, exit: 0, route: {}};

            for(const id of config.entrances) {
                if(id == req.query.junction_id) {
                    continue;
                }
                details.route[`${req.query.junction_id}->${id}`] = 0;
                details.route[`${id}->${req.query.junction_id}`] = 0;
            }

            for(const record of records) {
                if(record.entrance_id == req.query.junction_id) {
                    details.entrance++;
                    details.route[`${req.query.junction_id}->${record.exit_id}`]++;
                } else if(record.exit_id == req.query.junction_id) {
                    details.exit++;
                    details.route[`${record.entrance_id}->${req.query.junction_id}`]++;
                }
            }

            //console.log(details);
            res.json(details);
        } else {
            // all records
            const records = await db.getVehicleData(null, null, null, 
                parseInt(req.query.entrance_time), parseInt(req.query.exit_time),
                req.query.inclusive);

            const details = { entrance: {}, exit: {}, route: {} };

            // construct details array
            // load entrances from config
            for (const entrance of config.entrances) {
                details.entrance[entrance] = 0;
                details.exit[entrance] = 0;
                // routes
                for (const exit of config.entrances) {
                    if (entrance == exit) {
                        continue;
                    }
                    details.route[`${entrance}->${exit}`] = 0;
                }
            }

            // derived fields
            for (const record of records) {
                details.entrance[record.entrance_id]++;
                details.exit[record.exit_id]++;
                details.route[`${record.entrance_id}->${record.exit_id}`]++;
            }

            res.json(details);
        }        
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

if (config.operationMode == "audit") {
    app.get('/api/audit/vehicle', checkJwt, checkScopes_admin, async (req, res) => {
        // serve all vehicle records
        try {
            const records = await db.getVehicles(req.query.entrance_id, req.query.exit_id, req.query.junction_id,
            	parseInt(req.query.entrance_time), parseInt(req.query.exit_time), req.query.inclusive);
            res.json(records);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }) 
}

module.exports = app;