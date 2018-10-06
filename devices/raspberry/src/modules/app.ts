import Camera from './camera';
import Pir from './pir';
import Sockets from './webSockets';
import ArpScan from './arpscan';
import wsMessage from'../../../../common/utils/wsMessage';
import * as fs from 'fs-extra';

/*
* App module.
*/
export default class App {
  config;

  settings: {
    pirOn: boolean,
    pirOnWhenNobodyHome: boolean,
  };

  // state
  someoneHome = false;
  macMap = {};

  // modules
  arpscan;
  camera;
  pir;
  sockets;

  constructor(config) {
    this.settings = fs.readJsonSync('./settings.json');
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
            'detectionStatus': this.settings.pirOn,
            'lastDetected': this.pir.state.lastDetected,
            'newDetection': newDetection,
            'pirOnWhenNobodyHome': this.settings.pirOnWhenNobodyHome,
          },
          network: { 'macMap': this.macMap },
        },
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
    } catch (error) {
      console.log('Camera error', error);
    } finally {
      setTimeout(() => this.pir.resumeDetection(), 3000);
    }
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
      if (this.settings.pirOn || this.settings.pirOnWhenNobodyHome && !this.someoneHome) {
        await this.camera.takePicture();
        this.sockets.send(this.reportState());
      }
    });
  }

  saveSettings() {
    fs.writeJsonSync('./settings.json', this.settings);
  }

  async deviceCommandHandler(send, data) {
    switch (data.cmdId) {
      case 'takePicture':
        await this.takePicture();
        break;
      case 'toggleDetection':
        this.settings.pirOn = !this.settings.pirOn;
        this.saveSettings();
        break;
      case 'deletePictures':
        await this.camera.deletePictures();
        break;
      case 'togglePirWhenNobodyHome':
        this.settings.pirOnWhenNobodyHome = !this.settings.pirOnWhenNobodyHome;
        this.saveSettings();
        break;
      default:
        break;
    }
    send(this.reportState());
  }

}
