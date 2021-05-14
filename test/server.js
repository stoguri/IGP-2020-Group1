// tests for the server
'use strict';

const fetch = require('node-fetch');
const config = require('../client/src/config.json');
const { expect } = require('chai');

// %%% functions %%%

/**
 * Compares two vehicle data jsons
 * @param {[json]} expected 
 * @param {[json]} real 
 * @returns validity, error if failed to meet a condition
 */
function checkVehicleDataJSONs(expected, real) {
    if(Object.keys(expected).length != Object.keys(real).length) {
        return new Error("Outer key lengths do not match");
    }

    if(Object.keys(expected.entrance).length != Object.keys(real.entrance).length) {
        return new Error(`Expected to have ${Object.keys(expected.entrances).length} entrances, got ${Object.keys(real.entrance).length}`);
    }
    for(const key of Object.keys(expected.entrance)) {
        if(expected.entrance[key] != real.entrance[key]) {
            return new Error(`Expected entrance ${key} to have ${expected.entrance[key]} vehicles, got ${real.entrance[key]}`);
        }
    }

    if(Object.keys(expected.exit).length != Object.keys(real.exit).length) {
        return new Error(`Expected to have ${Object.keys(expected.exit).length} exits, got ${Object.keys(real.exit).length}`);
    }
    for(const key of Object.keys(expected.exit)) {
        if(expected.exit[key] != real.exit[key]) {
            return new Error(`Expected exit ${key} to have ${expected.exit[key]} vehicles, got ${real.exit[key]}`);
        }
    }

    if(Object.keys(expected.route).length != Object.keys(real.route).length) {
        return new Error(`Expected to have ${Object.keys(expected.route).length} routes, got ${Object.keys(real.route).length}`);
    }
    for(const key of Object.keys(expected.route)) {
        if(expected.route[key] != real.route[key]) {
            return new Error(`Expected route ${key} to have ${expected.route[key]} vehicles, got ${real.route[key]}`);
        }
    }
}

const url_auth = `https://${config.auth.domain}/oauth/token`;
let url_server = `://chungus.co.uk:8080`;
if(config.network.server.https) {
    url_server = 'https' + url_server;
} else {
    url_server = 'http' + url_server;
}

const body = {
    client_id: config.auth.test.writer.clientID,
    client_secret: config.auth.test.writer.clientSecret,
    audience: config.auth.api.identifier,
    grant_type: "client_credentials"
}

describe("GET /api/vehicle", () => {
    let token;

    beforeEach(async () => {
        const response = await fetch(url_auth, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(body),
        });
        token = (await response.json()).access_token;
    });

    describe("No query parameters", () => {
        it("Status code valid", async () => {
            console.log("starting test...");

            const response = await fetch(url_server + '/api/vehicle', {
                url: config.auth.api.identifier,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });

            console.log(response.status);
            expect(response.status).to.equal(200);
        });

        it("Expected", () => {
            const expected = {
                entrance: {
                    id0: 3, 
                    id1: 4, 
                    id2: 1, 
                    id3: 3
                },
                exit: {
                    id0: 3, 
                    id1: 3, 
                    id2: 4, 
                    id3: 1
                },
                route: { 
                    'id0-id1': 2,
                    'id0-id2': 0,
                    'id0-id3': 1,
                    'id1-id0': 1,
                    'id1-id2': 3,
                    'id1-id3': 0,
                    'id2-id0': 0,
                    'id2-id1': 1,
                    'id2-id3': 0,
                    'id3-id0': 2,
                    'id3-id1': 0,
                    'id3-id2': 1
                }
            }

            /*
            const validity = checkVehicleDataJSONs(expected, res.body);
            if(validity instanceof Error) {
                throw validity;
            }
            */
        });
    });
});