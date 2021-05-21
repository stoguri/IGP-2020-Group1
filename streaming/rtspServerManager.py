import subprocess
import time
import optparse

streams = [
    {'name': 'id0', 'source': 'Sam2.mp4', 'port': 8554},
    {'name': 'id1', 'source': 'C2.mp4', 'port': 8555},
    {'name': 'id2', 'source': 'S2.mp4', 'port': 8556},
    {'name': 'id3', 'source': 'Nat2.mp4', 'port': 8557}
]

pids = []
lengths = []

def main():
    # read in args
    parser = optparse.OptionParser()
    parser.add_option('-l', action="store", dest="loop")
    parser.add_option('-i', action="store", dest="total")
    options, _ = parser.parse_args()

    def startStreams():
        # start processes
        for stream in streams:
            # get length of sources
            result = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", stream["source"]],
                stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            #stream['length'] = float(result.stdout)
            lengths.append(float(result.stdout))

            command = f'python3 rtspServer.py -n {stream["name"]} -s {stream["source"]} -p {stream["port"]}'
            pids.append(subprocess.Popen([command], shell=True))

    print('starting video streams...')
    startStreams()

    # time until video is completed - incremented in 0.5s
    videoTime = 0
    # current iteration of video playing
    i = 1
    # total number of times to play video
    if(options.total):
        total = int(options.total)
    else:
        total = 1
    
    print(total)
    print(bool(options.loop))

    while(i <= total):
        print("Playing sources, iteration: " + str(i))
        while(videoTime < min(lengths)):
            if(videoTime % 5 == 0):
                print('rtsp server heartbeat, cancel with ctrl+c to kill python processes properly')
            time.sleep(0.5)
            videoTime += 0.5

        if(bool(options.loop)):
            total += 1

        for pid in pids:
            pid.kill()

        videoTime = 0
        i += 1

        startStreams()

try:
    main()
except KeyboardInterrupt:
    print('Interrupted')
    for pid in pids:
        pid.kill()