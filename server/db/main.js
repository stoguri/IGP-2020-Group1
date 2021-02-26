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
 * increments the count field in a record
 * @param {integer} entrance id of entrance to be incremented
 * @returns {integer} status code reporting success of function execution
 */
module.exports.incrementEntrance = async function(entrance) {
    try {
        const collection = await db.collection('entrances');

        const filter = {$where: `this.id == ${entrance}`};
        const update = {
            $inc: {'count': 1}
        };

        await collection.updateOne(filter, update);

        return 202;
    } catch(e) {
        console.error(e);
        return 500;
    }
}