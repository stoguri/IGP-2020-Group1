import subprocess
import time

streams = [
    {'name': 'id0', 'source': 'C2.mp4', 'port': 8554},
    {'name': 'id1', 'source': 'Sam2.mp4', 'port': 8555},
    {'name': 'id2', 'source': 'Nat2.mp4', 'port': 8556},
    {'name': 'id3', 'source': 'S2.mp4', 'port': 8557}
]

pids = []

def main():
    # start processes
    for stream in streams:
        command = f'python3 rtspServer.py -n {stream["name"]} -s {stream["source"]} -p {stream["port"]}'

        pids.append(subprocess.Popen([command], shell=True))

    while(True):
        print('rtsp server heartbeat, cancel with ctrl+c to kill python processes properly')
        time.sleep(5)

try:
    main()
except KeyboardInterrupt:
    print('Interrupted')
    for pid in pids:
        pid.kill()