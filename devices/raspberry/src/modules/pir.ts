import {Gpio} from 'onoff';
import {EventEmitter} from 'events';

/*
* Motion detection module.
*/
export default class Pir extends EventEmitter {
  pir;

  // state
  detectionStatus = 0;
  detectionPaused = false;
  lastDetected = null;

  constructor() {
    super();

    // pir pin
    this.pir = new Gpio(4, 'in', 'both');

    // start motion detection
    this.pir.watch((err, value) => {
      if (!this.detectionStatus || this.detectionPaused) {
        return;
      }
      this.lastDetected = Date.now();
      this.emit('motionDetected');
    });
  }

  /*
	* Get motion detector state.
	*/
  get state() {
    return {
      detectionStatus: this.detectionStatus,
      lastDetected: this.lastDetected,
    };
  }

  /*
	* Toggle motion detection on/off .
	*/
  toggleDetection() {
    this.detectionStatus = this.detectionStatus === 1 ? 0 : 1;
  }

  /*
	* Set motion detection state.
	*/
  setDetection(state) {
    this.detectionStatus = state ? 1 : 0;
  }

  /*
	* Pause motion detection.
	*/
  pauseDetection() {
    this.detectionPaused = true;
  }

  /*
	* Resume motion detection.
	*/
  resumeDetection() {
    this.detectionPaused = false;
  }
}
