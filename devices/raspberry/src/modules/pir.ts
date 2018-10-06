import {Gpio} from 'onoff';
import {EventEmitter} from 'events';

/*
* Motion detection module.
*/
export default class Pir extends EventEmitter {
  pir;

  // state
  detectionPaused = false;
  lastDetected = null;

  constructor() {
    super();

    // pir pin
    this.pir = new Gpio(4, 'in', 'both');

    // start motion detection
    this.pir.watch((err, value) => {
      if (this.detectionPaused) {
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
      lastDetected: this.lastDetected,
    };
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
