import {exec} from 'child_process';
import {EventEmitter} from 'events';

/*
* Home network module.
*/
export default class ArpScan extends EventEmitter {
  scanInterval = 10000;
  fiveMinuteInterval = 300000;
  fiveMinuteMark = 0;
  macMap = {};
  cachedMacMap = {};

  constructor(scanInterval, fiveMinuteInterval) {
    super();

    this.scanInterval = scanInterval || this.scanInterval;
    this.fiveMinuteInterval = fiveMinuteInterval || this.fiveMinuteInterval;
  }

  /*
	* Scan local wifi network for connecte devices
	*/
  scan() {
    exec('sudo arp-scan --interface=wlan0 --localnet', (err, res) => {
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
