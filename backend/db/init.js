// init the database
'use strict';

const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const users = require('../users.json');

// connect to database
const client = new MongoClient(`mongodb://${config.db.domain}:${config.db.port}`, { useUnifiedTopology: true });

client.connect(async (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Setting up database...");

        console.log("Connected to MongoDB server");
        const db = await client.db(config.db.name);

        // if database exists then drop it
        await db.dropDatabase();

        // populate with real data
        await db.collection('users').insertMany(users.users);
        // strip password out of json
        for(let i = 0; i < users.users_headless.length; i++) {
            delete users.users_headless[i].password;
        }
        await db.collection('users').insertMany(users.users_headless);

        console.log("Completed database setup");
    }
    process.exit();
});