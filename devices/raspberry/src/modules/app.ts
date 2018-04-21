import Camera from './camera';
import Pir from './pir';
import Sockets from './webSockets';
import ArpScan from './arpscan';
import wsMessage from'../../../../common/utils/wsMessage';

/*
* App module.
*/
export default class App {
  config;

  // state
  turnDetectionOnWhenNobodyHome = true;
  someoneHome = false;
  macMap = {};

  // modules
  arpscan;
  camera;
  pir;
  sockets;

  constructor(config) {
    this.config = config;

    this.arpscan = new ArpScan(null, 60000);
    this.camera = new Camera();
    this.pir = new Pir();

    this.sockets = new Sockets({
      port: config.wsPort,
      deviceId: config.deviceId,
      onMessage: {
        'deviceCommand': (send, data) => this.deviceCommandHandler(send, data),
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
  }

  /*
	* Return all modules states.
	*/
  reportState(newDetection = false) {
    return wsMessage.prep(
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
          network: { 'macMap': this.macMap },
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
    await this.camera.takePicture();
    setTimeout(this.pir.resumeDetection, 3000);
  }

  /*
	* Initialize raspberry home automation unit app.
	*/
  async start() {
    await this.camera.readImages();
    await this.sockets.start();
    this.arpscan.watch();
    // listen to arpscan results
    this.arpscan.on('arpScanUpdate', macMap => {
      this.macMap = Object.assign({}, macMap);
      this.sockets.send(this.reportState());
    });
    // listen to motion detector events
    this.pir.on('motionDetected', async () => {
      await this.takePicture();
      this.sockets.send(this.reportState(true));
    });
  }

  turnDetectionOn() {
    if (this.turnDetectionOnWhenNobodyHome && !this.someoneHome) {
      this.pir.setDetection(1);
    }
  }

  async deviceCommandHandler(send, data) {
    switch (data.cmdId) {
      case 'takePicture':
        await this.takePicture();
        send(this.reportState());
        break;
      case 'toggleDetection':
        if (
          !this.someoneHome // dont turn detection off if nobody home and
          && this.turnDetectionOnWhenNobodyHome // turnDetectionOnWhenNobodyHome is set to true
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
  }

}
