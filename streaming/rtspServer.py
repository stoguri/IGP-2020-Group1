import sys
import gi
import optparse

gi.require_version('Gst', '1.0')
gi.require_version('GstRtspServer', '1.0')

from gi.repository import Gst, GstRtspServer, GObject, GLib

loop = GLib.MainLoop()
Gst.init(None)

class TestRtspMediaFactory(GstRtspServer.RTSPMediaFactory):
    def __init__(self, source):
        GstRtspServer.RTSPMediaFactory.__init__(self)
        self.source = source
    
    def do_create_element(self, url):
        src_demux = "filesrc location=/mnt/c/Users/Robert/Documents/Programming/Repositories/IGP-2020-Group1/streaming/{0} ! qtdemux name=demux".format(self.source)

        h264_transcode = "demux.video_0"
        # transcoding
        #h264_transcode = "demux.video_0 ! --vout-filter=transform --transform-type=180"
        
        pipeline = "{0} {1} ! queue ! rtph264pay name=pay0 config-interval=1 pt=96".format(src_demux, h264_transcode)
        
        print("element created: " + pipeline)
        return Gst.parse_launch(pipeline)

class GstreamerRtspServer():
    def __init__(self, stream):
        self.rtspServer = GstRtspServer.RTSPServer()

        # set port
        self.rtspServer.set_service(stream['port'])

        factory = TestRtspMediaFactory(stream['source'])
        factory.set_shared(True)

        mountPoints = self.rtspServer.get_mount_points()
        mountPoints.add_factory('/' + stream['name'], factory)

        self.rtspServer.attach(None)

def main():
    # parse args
    parser = optparse.OptionParser()

    parser.add_option('-n', action="store", dest="name")
    parser.add_option('-s', action="store", dest="source")
    parser.add_option('-p', action="store", dest="port")

    options, args = parser.parse_args()

    #print("starting server...")
    GstreamerRtspServer({
        'name': options.name,
        'source': options.source,
        'port': options.port
    })

    #print("starting loop...")
    loop.run()

main()