# node-media-server (original link: https://www.npmjs.com/package/node-media-server)
Install node-media-server as below 

```
# choose a directory to place the nms
mkdir nms
cd nms
npm install node-media-server
touch app.js
```

# app.js
Insert this code into app js

```
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();
```

# run the server

```
node app.js
```

# streaming a video
Replace "STREAM" with the desired stream name

```
ffmpeg -re -i sample.mp4 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/STREAM
```

# testing stream
You can view current streams while the nms is running, here: http://localhost:8000/admin/streams

# front-end
This is the html/js for serving the livestream in the browser. Note that script only needs to be called once - do not duplicate the cdn request.

Replace "STREAM" with the desired name

```
<script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
<video id="videoElement"></video>
<script>
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8000/live/STREAM.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
</script>
```
