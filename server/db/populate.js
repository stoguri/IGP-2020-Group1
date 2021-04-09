// populate the database with test data
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const testData = require('./testData');

// connect to database
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`,
    {useUnifiedTopology: true});

client.connect(err => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to MongoDB server");
        const db = client.db(config.db.name);

        // vehicle records
        db.collection('vehicles').insertMany(testData.vehicles);
    
        // user records
        // strip password out of json
        for(let i = 0; i < testData.users.length; i++) {
            delete testData.users[i].password;
        }
        db.collection('users').insertMany(testData.users);

        console.log("Database populated, exit using ctrl+c");
    }
});