'use strict';

const express = require('express');
const session = require('express-session');
const passport = require('passport');

// %%% init server %%% 

const app = express();

const config = require('./config');

const server = app.listen(config.network.port, () => {
    console.log('Server listening on:', config.network.domain + ':' + config.network.port);
});

app.use('/', express.static('client', { 'extensions': ['html'] }));

app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// %%% passport middleware %%%

require('./auth.js');

app.use(passport.initialize());

app.use(passport.session());

/**
 * Login using auth0 strategy
 */
app.get('/auth/login/auth0', passport.authenticate('auth0', {
    // define what user info is sent
    scope: ['openid', 'profile'],
}
));

app.get('/auth/callback', passport.authenticate('auth0'), (req, res) => {
    req.session.user = req.user;
    req.session.auth = true;

    console.log(req.session.user.displayName + " authenticated.");

    res.redirect('/');
});

app.get('/auth/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
        res.end();
    });
});

// %%% authentication routes & functions %%%

/**
 * check if the user has an authenticated session
 * @response {status}
 */
app.get('/auth/authCheck', (req, res) => {
    if (req.session.auth) {
        res.sendStatus(204);
    } else {
        res.sendStatus(403);
    }
});

const fs = require('fs');
const https = require('https');
const http = require('http');
const { Stream } = require('stream');

app.get('/liveStream', function (req, res) {
    writeStream();
    setTimeout(() =>    stream(req, res), 2000);
});

let count = 0;

/*
    attempting to stream to client from file server
*/

function reqStream(req, res) {
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/liveStreamSource',
        method: 'GET'
    };

    const sourceReq = http.request(options, sourceRes => {
        console.log(`statusCode: ${sourceRes.statusCode}`);

        const readable = new Stream.Readable();
        const head = {
            'Content-Length': '',
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);

        sourceRes.on('data', d => {
            // process.stdout.write(d)
            count++;
            console.log(count + '      ', d);
            readable.push(d);
        })

        readable.push('hello');
        readable.push(null);
        readable.pipe(res);
    });

    sourceReq.on('error', error => {
        console.error(error)
        res.sendStatus(500);
    });

    sourceReq.end();
}

/*
    attempting to write a file, and simultaneously stream to the client
*/
function writeStream() {
    const writeable = fs.createWriteStream('vid.mp4');

    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/liveStreamSource',
        method: 'GET'
    };

    const sourceReq = http.request(options, sourceRes => {
        console.log(`statusCode: ${sourceRes.statusCode}`);

        sourceRes.on('data', chunk => {
            // process.stdout.write(chunk)
            count++;
            // console.log(count + '      ', chunk);
            writeable.write(chunk);
        });
    });

    sourceReq.on('error', error => {
        console.error(error)
        res.sendStatus(500);
    });

    sourceReq.end();
}

function stream(req, res) {
    const path = 'vid.mp4'
    const stat = fs.statSync(path)
    const fileSize = 10546620
    const range = req.headers.range
    console.log('streaming, range:' + range);
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
}