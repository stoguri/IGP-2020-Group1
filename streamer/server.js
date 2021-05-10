'use strict';

const express = require('express');

// %%% init server %%% 

const app = express();

const server = app.listen(3001, () => {
    console.log('Server listening on port:' + 3001);
});

app.use('/', express.static('client', { 'extensions': ['html'] }));

const fs = require('fs');

app.get('/liveStreamSource', function (req, res) {
    const path = './streamer/sample.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    console.log(fileSize)
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
});