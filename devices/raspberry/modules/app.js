const Camera = require('./camera');
const Pir = require('./pir');
const Sockets = require('./webSockets');
const ArpScan = require('./arpscan');
const {jsonToMessage} = require('../../../common/utils/wsMessage');

/*
* App module.
*/
class App {
	constructor(config) {
		this.config = config;

		// state
		this.turnDetectionOnWhenNobodyHome = false;
		this.someoneHome = false;

		this.arpscan = new ArpScan(null, 60000);
		this.camera = new Camera();
		this.pir = new Pir();

		this.sockets = new Sockets({
			port: config.wsPort,
			deviceId: config.deviceId,
			onMessage: {
				'deviceCommand': async(send, data) => {
					switch (data.cmdId) {
						case 'takePicture':
							await this.takePicture();
							send(this.reportState());							
							break;

						case 'toggleDetection':
							// dont turn detection off if nobody home and
							// turnDetectionOnWhenNobodyHome is set to true
							if (
								!this.someoneHome
								&& this.turnDetectionOnWhenNobodyHome
								&& this.pir.state.detectionStatus === 1
							) {
								send(this.reportState());
								break;
							}

							this.pir.toggleDetection();
							send(this.reportState());
							break;

						case 'deletePictures':
							await this.camera.deletePictures();
							send(this.reportState());
							break;

						case 'toggleDetectionWhenNobodyHome':
							this.turnDetectionOnWhenNobodyHome = !this.turnDetectionOnWhenNobodyHome;
							this.turnDetectionOn();
							send(this.reportState());
							break;

						default:
							break;
					}
				},
				'someoneHome': (send, data) => {
					this.someoneHome = data;
					this.turnDetectionOn();
					send(this.reportState());
				},
				'default': send => {
					send(this.reportState());
				},
			},
		});

		this.macMap = {};
	}

	/*
	* Return all modules states.
	*/
	reportState(newDetection) {
		return jsonToMessage(
			'stateUpdate',
			{
				state: {
					security: {
						'images': this.camera.state.images,
						'detectionStatus': this.pir.state.detectionStatus,
						'lastDetected': this.pir.state.lastDetected,
						'newDetection': newDetection,
						'turnDetectionOnWhenNobodyHome': this.turnDetectionOnWhenNobodyHome,
					},
					network: {'macMap': this.macMap},
				},
				// commands: ['take picture', 'toggle detection', 'delete pictures'],
				// _id: this.config.deviceId,
			}
		);
	}

	/*
	* Take picture with camera module.
	*/
	async takePicture() {
		this.pir.pauseDetection();

		try {
			await this.camera.takePicture();

			setTimeout(() => {
				this.pir.resumeDetection();
			}, 3000);
		} catch (error) {
			console.log('App takePicture error: ', error);
		}
	}

	/*
	* Initialize raspberry home automation unit app.
	*/
	async start() {
		try {
			await this.camera.readImages();
			await this.sockets.start();

			this.arpscan.watch();

			// listen to arpscan results
			this.arpscan.on('arpScanUpdate', macMap => {
				this.macMap = Object.assign({}, macMap);
				this.sockets.send(this.reportState());
			});

			// listen to motion detector events
			this.pir.on('motionDetected', async() => {
				await this.takePicture();
				this.sockets.send(this.reportState(true));
			});
		} catch (error) {
			console.log('App start error: ', error);
		}
	}

	turnDetectionOn() {
		if (this.turnDetectionOnWhenNobodyHome && !this.someoneHome) {
			this.pir.setDetection(1);
		}
	}

}

module.exports = App;
