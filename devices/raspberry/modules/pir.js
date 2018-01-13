const Gpio = require('onoff').Gpio;
const EventEmitter = require('events');

/*
* Motion detection module.
*/
class Pir extends EventEmitter {

    constructor() {
        super();

        // pir pin
        this.pir = new Gpio(4, 'in', 'both');

        // state
        this.detectionStatus = 0;
        this.detectionPaused = false;
        this.lastDetected = null;

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

module.exports = Pir;
