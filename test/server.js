// tests for the server
'use strict';

const crypto = require('crypto');
const session = require('supertest-session');

const config = require('../server/config.json');
const app = require('../server/server.js');

const testData = require('../server/db/testData.json');

const writer = testData.users[0];
const admin = testData.users[1];
const basic = testData.users[2];

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

let testSession;

// %%% test cases %%%
describe("Test headless login", () => {
    let currentSession;

    beforeEach(() => {
        testSession = session(app);
    });

    describe("Invalid id", () => { 
        it("Unauthenticated session before login attempt", (done) => {
            testSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    currentSession = testSession;

                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
        it("Login attempt returns status 404", (done) => {
            currentSession.get('/auth/login/headless')
                .query(({id: "fakeID", password: "fakePassword"}))
                .expect(404)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
        it("Unauthenticated session after unsuccessful login attempt", (done) => {
            currentSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
    });

    describe("Valid id, invalid password", () => {
        it("Unauthenticated session before login attempt", (done) => {
            testSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    currentSession = testSession;

                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
        it("Login attempt returns status 401", (done) => {
            currentSession.get('/auth/login/headless')
                .query(({id: writer.id, password: "fakePassword"}))
                .expect(401)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
        it("Unauthenticated session after login attempt", (done) => {
            currentSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
    });

    describe("Valid id and password", () => {
        it("Unauthenticated session before any login attempt", (done) => {
            testSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    currentSession = testSession;

                    if(err) {
                        return done(err);
                    }
                    
                    done();
                });
        });
        it("Login attempt returns status 200", (done) => {
            // get encrypted version of password
            const hash = crypto.createHash(config.auth.encryptionMethod);
            hash.update(writer.password);

            currentSession.get('/auth/login/headless')
                .query(({id: writer.id, password: hash.digest('hex')}))
                .expect(200)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }
                    done();
                });
        });
        it("Authenticated session after successful login attempt ", (done) => {
            currentSession.get('/auth/check')
                .expect(204)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }

                    done();
                });
        });
        it("Returns status 200 after logout attempt", (done) => {
            currentSession.get('/auth/logout')
                .expect(200)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }

                    done();
                });
        });
        it("Unauthenticated session after logout attempt", (done) => {
            currentSession.get('/auth/check')
                .expect(401)
                .end((err) => {
                    if(err) {
                        return done(err);
                    }

                    done();
                });
        });
    });
});

describe("GET /api/vehicle/", () => {
    let currentSession;

    beforeEach(() => {
        testSession = session(app);
    });

    describe("Access rights based on permission level", () => {
        describe("Attempt to access with unauthenticated session", () => {
            it("Returns status 401 on access attempt", (done) => {
                testSession.get('/api/vehicle')
                    .expect(401)
                    .end((err) => {
                        if(err) {
                            return done(err);
                        }

                        done();
                    });
            });
        });

        describe("Attempt to access with authenticated session as writer user", () => {            
            it("Login as writer user returns 200", (done) => {
                // login as headless writer user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(writer.password);

                testSession.get('/auth/login/headless')
                    .query(({id: writer.id, password: hash.digest('hex')}))
                    .expect(200)
                    .end((err) => {
                        currentSession = testSession;

                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });

            it("Returns status 403 on access attempt", (done) => {
                currentSession.get('/api/vehicle')
                    .expect(403)
                    .end((err) => {
                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
        });

        describe("Attempt to access with authenticated session as admin user", () => {            
            it("Login as admin user returns 200", (done) => {
                // login as headless writer user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(admin.password);

                testSession.get('/auth/login/headless')
                    .query(({id: admin.id, password: hash.digest('hex')}))
                    .expect(200)
                    .end((err) => {
                        currentSession = testSession;

                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
            it("Returns status 200 on access attempt", (done) => {
                currentSession.get('/api/vehicle')
                    .expect(200)
                    .end((err) => {
                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
        });

        describe("Attempt to access with authenticated session as basic user", () => {
            it("Login as basic user returns 200", (done) => {
                // login as headless writer user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(basic.password);

                testSession.get('/auth/login/headless')
                    .query(({id: basic.id, password: hash.digest('hex')}))
                    .expect(200)
                    .end((err) => {
                        currentSession = testSession;

                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
            it("Returns status 200 on access attempt", (done) => {
                currentSession.get('/api/vehicle')
                    .expect(200)
                    .end((err) => {
                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
        });
    });
    
    describe("Query paramters", () => {
        describe("No parameters - all records", () => {
            it("Login as basic user returns 200", (done) => {
                // login as headless writer user
                // get encrypted version of password
                const hash = crypto.createHash(config.auth.encryptionMethod);
                hash.update(basic.password);

                testSession.get('/auth/login/headless')
                    .query(({id: basic.id, password: hash.digest('hex')}))
                    .expect(200)
                    .end((err) => {
                        currentSession = testSession;

                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
            it("Received data matches expected data", (done) => {
                currentSession.get('/api/vehicle')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .expect((res) => {
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
                        const validity = checkVehicleDataJSONs(expected, res.body);
                        if(validity instanceof Error) {
                            throw validity;
                        }
                    })
                    .end((err) => {
                        if(err) {
                            return done(err);
                        }
                        done();
                    });
            });
        });

        /*
        describe("Route information", function() {
            describe("Entrance id only", function() {
                const query = "?entrance_id=";

                describe("Entrance id with no records", function() {
                    it("Returns status 202", async function() {
                        // login as headless basic user
                        // get encrypted version of password
                        const hash = crypto.createHash(config.auth.encryptionMethod);
                        hash.update(basic.password);

                        await fetch(url + '/auth/login/headless' +
                        `?id=${basic.id}&password=${hash.digest('hex')}`);

                        const url1 = "http://chungus.co.uk:7070/api/vehicle?entrance_id=fakeID";
                        response = await fetch(url1);
                        console.log(response);
                        //response = await fetch(url + route + query + "id0"); 

                        expect(response.status == 202);
                    })

                    it("No records found", async function() {
                        const results = await response.json();

                        console.log(results);

                        expect(results.length == {});

                        await fetch(url + '/auth/logout');
                    })
                })
            })
            */

            /*
            //describe("Entrance id only", function() {
                const query = "?entrance=";
                console.log(url + route + query + "fakeID");
                
                describe("Entrance id with no records", function() {
                    it("Returns status 202", async function() {
                        response = await fetch(url + route + query + "fakeID");
                        console.log(response);
        
                        expect(response.status == 202);
                    })

                    const results = response.json();

                    it("No records found", function() {
                        expect(results.length == 0);
                    })
                })


                describe("Entrance id with one vehicle record", function() {
                    const id = "id0";

                    it("Returns status 202", async function() {
                        response = await fetch(url + route + query + id);
        
                        expect(response.status == 202);
                    })

                    const results = response.json();

                    it("One record found", function() {
                        expect(results.length == 1);
                    })
    
                    it("Record data matches expected data", async function() {
                        expect(results == findJsons(testData.vehicles,
                            {"entrance_id": id}));
                    })
                })
            //})
            */

            /*
            describe("Exit id only", function() {
                it("Returns status 202", async function() {
                    // login as headless basic user
                    // get encrypted version of password
                    const hash = crypto.createHash(config.auth.encryptionMethod);
                    hash.update(basic.password);
    
                    await fetch(url + '/auth/login/headless' +
                    `?id=${basic.id}&password=${hash.digest('hex')}`);
    
                    response = await fetch(url + route);
    
                    expect(response.status == 202);
                })

                it("Received data matches expected data", async function() {
                    expect(response.json() == findJsons(testData.vehicles,
                        {"exit_id": "id1"}));
    
                    await fetch(url + '/auth/logout');
                })
            })
            
            // full route ids
        })
        */
        
        // entrance time only
        // exit time only
        // full route times
    })
});