// populate the database with test data
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../../client/src/config.json');
const testData = require('./testData');

// connect to database
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`,
    {useUnifiedTopology: true});

client.connect(async(err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Connected to MongoDB server");
        const db = await client.db(config.db.name);

        // vehicle records
        await db.collection('vehicles').insertMany(testData.vehicles);
    
        // user records
        // strip password out of json
        for(let i = 0; i < testData.users.length; i++) {
            delete testData.users[i].password;
        }
        await db.collection('users').insertMany(testData.users);

        console.log("Database populated");
    }
    process.exit();
});