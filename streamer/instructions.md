# install nms https://www.npmjs.com/package/node-media-server

```
mkdir nms
cd nms
npm install node-media-server
touch app.js
```

# code inside app.js

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

```
ffmpeg -re -i sample.mp4 -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/stream1
```

# code for serving the livestream

```
<script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
<video id="videoElement"></video>
<script>
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8000/live/stream1.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
</script>
```