import subprocess
import threading
import sys
import os
import time

host = "101.34.30.11"
user = "ubuntu"
password = "971106Yan"
cmd = "echo CONNECTED; hostname; uname -a"

proc = subprocess.Popen(
    ["ssh", "-o", "StrictHostKeyChecking=accept-new", "-o", "UserKnownHostsFile=NUL",
     "-o", "ServerAliveInterval=30", "-tt",
     f"{user}@{host}", cmd],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=False
)

time.sleep(2)

proc.stdin.write((password + "\n").encode())
proc.stdin.flush()

try:
    stdout, stderr = proc.communicate(timeout=15)
    print("STDOUT:", stdout.decode("utf-8", errors="replace"))
    if stderr:
        print("STDERR:", stderr.decode("utf-8", errors="replace"))
    print("EXIT CODE:", proc.returncode)
except subprocess.TimeoutExpired:
    proc.kill()
    print("TIMEOUT")
