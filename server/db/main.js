// main functions for interfacing with mongodb
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

// TODO export this to external
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`,
    {useUnifiedTopology: true});

let db;

client.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log("Setting up database...");

        console.log("Connected to MongoDB server");
        db = client.db(config.db.name);
    }
});

/**
 * Adds a new vehicle record
 * @param {identifer} identifier of new vehicle
 * @param {integer} entrance_id 
 * @param {time} entrance_time 
 * @returns {integer} status code
 */
module.exports.newVehicle = async function(identifier, entrance_id, entrance_time) {
    try {
        await db.collection('vehicles').insertOne({
            identifier: identifier,
            entrance_id: entrance_id,
            entrance_time: entrance_time,
            exit_id: null,
            exit_time: null
        });        

        return 201;
    } catch(e) {
        console.error(e);
        return 500;
    }
}

/**
 * Updates existing vehicle record
 * @param {identifer} identifer of existing vehicle
 * @param {integer} exit_id 
 * @param {time} exit_time 
 * @returns {integer} status code
 */
module.exports.updateVehicle = async function(identifier, exit_id, exit_time) {
    try {
        const collection = await db.collection("vehicles");

        const filter = {$where: `this.identifier == ${identifier}`}
        const update = {
            $set: {
                exit_id: exit_id,
                exit_time: exit_time
            }
        };

        await collection.updateOne(filter, update);
        return 202;
    } catch(e) {
        console.error(e);
        return 500;
    }
}

/**
 * Get vehicle records
 * @param {string} entrance_id
 * @param {integer} entrance_time epoch time
 * @param {string} exit_id
 * @param {integer} exit_time epoch time
 * @param {boolean} inclusive if the times give are inclusive or exclusive
 * @returns {array} found records
 */
module.exports.getVehicles = async function(entrance_id, entrance_time, exit_id, exit_time, inclusive){
    try {
        const collection = await db.collection("vehicles");

        // construct query
        const query = {};
        if(entrance_id) {
            query.entrance_id = entrance_id;
        }
        if(exit_id) {
            query.exit_id = exit_id;
        }
        if(entrance_time) {
            if(inclusive == 'true') {
                query.entrance_time = {$gte: entrance_time};
            } else {
                query.entrance_time = {$lte: entrance_time};
            }
        }
        if(exit_time) {
            if(inclusive == 'true') {
                query.exit_time = {$lte: exit_time};
            } else {
                query.exit_time = {$gte: exit_time};
            }
        }

        // make query
        return await collection.find(query).toArray();
    } catch(e) {
        console.error(e);
        return 500;
    }
}