#Control pi from mac by remote screen

on pi:
tightvncserver

on mac:
cmd+k
“vnc://[ip address of pi]:5901”