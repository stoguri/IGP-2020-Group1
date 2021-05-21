const NodeMediaServer = require('node-media-server');
const appConfig = require('../client/src/config.json');

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
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: []
  },
  logType: 3
};

let port = 8554;
for(const entrance of appConfig.entrances) {
    config.relay.tasks.push({
      app: 'live',
      mode: 'static',
      //edge: `rtsp://chungus.co.uk:${port}/${entrance}`, // for accessing from external source
      edge: `rtsp://localhost:${port}/${entrance}`,
      name: entrance, 
      rtsp_transport: ['udp', 'tcp', 'udp_multicast', 'http'],
      allow_origin: '*'
    });

    port++;
}

var nms = new NodeMediaServer(config)
nms.run();