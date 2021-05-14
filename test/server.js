// tests for the server
'use strict';

const fetch = require('node-fetch');
const config = require('../client/src/config.json');
const { expect } = require('chai');

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
        let data; 

        it("Status code valid", async () => {
            console.log("starting test...");

            const response = await fetch(url_server + '/api/vehicle', {
                url: config.auth.api.identifier,
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            data = await response.json();
            expect(response.status).to.equal(200);
        });

        it("Expected data matches real data", async () => {
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
                    'id0->id1': 2,
                    'id0->id2': 0,
                    'id0->id3': 1,
                    'id1->id0': 1,
                    'id1->id2': 3,
                    'id1->id3': 0,
                    'id2->id0': 0,
                    'id2->id1': 1,
                    'id2->id3': 0,
                    'id3->id0': 2,
                    'id3->id1': 0,
                    'id3->id2': 1
                }
            }
            expect(JSON.stringify(expected)).to.equal(JSON.stringify(data));
        });
    });
});