# Connect to raspberry pi over ssh

arp -a (list all devices connected to network?)

ssh pi@[pi ip address] (raspberry hostname)

password (default - raspberry) jks90512

# VS Code remote control:

vs settings:
"remote.port": 52698,
"remote.onstartup": true

ssh -R 52698:localhost:52698 pi@[pi ip address]

install rmate in dir on raspberry (or else where?)
https://github.com/aurora/rmate

sudo wget -O /usr/local/bin/rmate https://raw.github.com/aurora/rmate/master/rmate
sudo chmod a+x /usr/local/bin/rmate

then

sudo rmate name_of_the_file

open vscode, file should be opened there