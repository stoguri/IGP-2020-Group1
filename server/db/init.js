// init the database
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

// connect to database
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`, { useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log("Setting up database...");

        console.log("Connected to MongoDB server");
        const db = client.db(config.db.name);

        // if database exists then drop it
        db.dropDatabase();

        console.log("Database initialised, exit using ctrl+c");
    }
});