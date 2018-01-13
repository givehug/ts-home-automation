#Flash nodemcu microcontroller with espruino (JS interpreter)

need:
pyserial
esptool
slab usb driver
CH34x_Install_V1.3 usb driver

MAC:

instal svl usb driver
https://www.silabs.com/Support%20Documents/Software/Mac_OSX_VCP_Driver.zip

plug nodemcu, check 
ls /dev/cu.*
ls /dev/tty.*

THIS:
esptool.py --port /dev/tty.SLAB_USBtoUART --baud 115200 write_flash --flash_freq 80m --flash_mode dio --flash_size 32m 0x0000 "boot_v1.6.bin" 0x1000 espruino_esp8266_user1.bin 0x3FC000 esp_init_data_default.bin 0x3FE000 blank.bin

--flash_mode qio or dio

erase flash:

esptool.py --port /dev/tty.wchusbserial1410 erase_flash 
esptool.py --port /dev/cu.SLAB_USBtoUART erase_flash 
esptool.py --port /dev/tty.SLAB_USBtoUART erase_flash 