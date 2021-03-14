// populate the database with test data
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const records = require('./testData');

// connect to database
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`,
    {useUnifiedTopology: true});

client.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to MongoDB server");
        const db = client.db(config.db.name);

        db.collection('vehicles').insertMany(records);
    
        console.log("Database populated, exit using ctrl+c");
    }
});