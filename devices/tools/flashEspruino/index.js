const {spawn} = require('child_process');
const path = require('path');

const USB_PORT = '/dev/cu.SLAB_USBtoUART';
const BAUD_RATE = 115200;

const esptool = spawn('esptool.py', [
    '--port', USB_PORT,
    '--baud', BAUD_RATE,
    'write_flash',
    '--flash_freq', '80m',
    '--flash_mode', 'dio',
    '--flash_size', '32m',
    '0x0000', path.resolve(__dirname, 'firmware/boot_v1.6.bin'),
    '0x1000', path.resolve(__dirname, 'firmware/espruino_esp8266_user1.bin'),
    '0x3FC000', path.resolve(__dirname, 'firmware/esp_init_data_default.bin'),
    '0x3FE000', path.resolve(__dirname, 'firmware/blank.bin'),
]);

esptool.stdout.on('data', data => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`${data}`);
});

esptool.stderr.on('data', data => {
    console.error(`${data}`);
});
