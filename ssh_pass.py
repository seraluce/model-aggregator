import subprocess
import select
import sys
import time

proc = subprocess.Popen(
    ["ssh.exe", "-o", "StrictHostKeyChecking=accept-new", "-o", "UserKnownHostsFile=NUL",
     "-o", "PreferredAuthentications=password", "-o", "PubkeyAuthentication=no",
     "-o", "ConnectTimeout=10", "-tt", "ubuntu@101.34.30.11", "echo SUCCESS"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
)

time.sleep(3)
proc.stdin.write(b"971106Yan\n")
proc.stdin.flush()

try:
    stdout, stderr = proc.communicate(timeout=15)
    out = stdout.decode("utf-8", errors="replace")
    err = stderr.decode("utf-8", errors="replace")
    print("STDOUT:", repr(out))
    print("STDERR:", repr(err))
    print("EXIT:", proc.returncode)
except subprocess.TimeoutExpired:
    proc.kill()
    print("TIMEOUT")
