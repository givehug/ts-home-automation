const child = require('child_process');
const EventEmitter = require('events');

/*
* Home network module.
*/
class ArpScan extends EventEmitter {

  constructor(scanInterval, fiveMinuteInterval) {
    super();

    this.scanInterval = scanInterval || 10000;
    this.fiveMinuteInterval = fiveMinuteInterval || 300000;
    this.fiveMinuteMark = 0;
    this.macMap = {};
    this.cachedMacMap = {};
  }

	/*
	* Scan local wifi network for connecte devices
	*/
  scan() {
    child.exec('sudo arp-scan --interface=wlan0 --localnet', (err, res) => {
      if (err) return console.log('ArpScan scan error: ', err);

      const now = Date.now();
      const macList = res
        .split('\n')
        .filter(x => x !== '')
        .map(m => m.split('\t'));

      macList.splice(0, 2);
      macList.splice(macList.length - 2);
      macList.forEach(m => this.macMap[m[1]] = m);

      // if more time past than fiveMinuteInterval, update fiveMinuteCachedMacList
      if (now - this.fiveMinuteMark > this.fiveMinuteInterval) {
        this.fiveMinuteMark = now;
        this.cachedMacMap = Object.assign({}, this.macMap);
        this.macMap = {};
        this.emit('arpScanUpdate', this.cachedMacMap);
      }
    });
  }

	/*
	* Perform scan with given interval
	*/
  watch() {
    setInterval(() => this.scan(), this.scanInterval);
  }
}

module.exports = ArpScan;
