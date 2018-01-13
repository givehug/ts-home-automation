#Enable raspberry camera

sudo raspi-config -> select from list in modal that appeared

if not in list:
sudo apt-get update
sudo apt-get upgrade

try: raspistill -o image.jpg

if errors:
sudo rpi-update (helped)
sudo apt-get dist-upgrade

navigate to pi/ dir , pictures should be there