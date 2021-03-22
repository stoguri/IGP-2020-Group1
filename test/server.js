// tests for the server
'use strict';

const expect = require('chai').expect;
const fetch = require("node-fetch");
const crypto = require('crypto');

const config = require('../server/config.json');

const testHeadlessUsers = require('../server/testHeadlessUsers.json');
const headlessUser_writer = testHeadlessUsers[0];
const headlessUser_admin = testHeadlessUsers[1];
const headlessUser_basic = testHeadlessUsers[2];

const testData = require('../server/db/testData.json');

const url = `http://${config.network.domain}:${config.network.port}`;

// result depends partially on contents of testHeadlessUsers.json
describe("Test headless login", function() {
    const route_authCheck = '/auth/check';
    const route_login = '/auth/login/headless';

    describe("Invalid username", function() { 
        it("unauthenticated session before login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
        it("login attempt returns status 404", async function() {
            const response = await fetch(url + route_login + 
                '?username=unregisteredUser&password=somePassword');
            expect(response.status == 404);
        });
        it("unauthenticated session after login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
    })

    describe("Valid username, invalid password", function() {
        it("unauthenticated session before login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
        it("login attempt returns status 401", async function() {
            const response = await fetch(url + route_login + 
                `?username=${headlessUser_writer.username}&password=somePassword`);
            expect(response.status == 401);
        });
        it("unauthenticated session after login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
    })

    describe("Valid credentials", function() {
        it("unauthenticated session before login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
        it("login attempt returns status 200", async function() {
            // get encrypted version of password
            const hash = crypto.createHash(config.auth.encryptionMethod);
            hash.update(headlessUser_writer.password);
        
            const response = await fetch(url + route_login + 
                `?username=${headlessUser_writer.username}&password=${hash.digest('hex')}`);
            expect(response.status == 200);
        })
        it("authenticated session after login attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 204);
        })
        it("returns status 200 after logout attempt", async function() {
            const response = await fetch(url + '/auth/logout');
            expect(response.status == 200);
        })
        it("unauthenticated session after logout attempt", async function() {
            const response = await fetch(url + route_authCheck);
            expect(response.status == 401);
        })
    })
})

describe("GET /api/vehicle/", function() {
    const route = '/api/vehicle';

    describe("Access rights based on permission level", function() {
        describe("Attempt to access with unauthenticated session", function() {
            it("returns status 401 on access attempt", async function() {
                const response = await fetch(url + route);
                expect(response.status == 401);
            })
        })

        describe("Attempt to access with authenticated session as writer user", function () {            
            it("returns status 401 on access attempt", async function() {
                // login as headless writer user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(headlessUser_writer.password);

                await fetch(url + '/auth/login/headless' +
                    `?username=${headlessUser_writer.username}&password=${hash.digest('hex')}`);
                
                const response = await fetch(url + route);
                expect(response.status == 401);

                await fetch(url + '/auth/logout');
            })
        })

        describe("Attempt to access with authenticated session as writer user", function () {            
            it("returns status 202 on access attempt", async function() {
                // login as headless admin user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(headlessUser_admin.password);

                await fetch(url + '/auth/login/headless' +
                    `?username=${headlessUser_admin.username}&password=${hash.digest('hex')}`);
                
                const response = await fetch(url + route);
                expect(response.status == 202);

                await fetch(url + '/auth/logout');
            })
        })

        describe("Attempt to access with authenticated session as writer user", async function () {
            it("returns status 202 on access attempt", async function() {
                // login as headless basic user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(headlessUser_basic.password);

                await fetch(url + '/auth/login/headless' +
                    `?username=${headlessUser_basic.username}&password=${hash.digest('hex')}`);
                
                const response = await fetch(url + route);
                expect(response.status == 202);

                await fetch(url + '/auth/logout');
            })
        })
    })

    // results depedent on testData.json
    describe("Query paramters", function() {
        // no parameters - all data

        // entrance id only
        // exit id only
        // full route ids
        
        // entrance time only
        // exit time only
        // full route times
    })
})