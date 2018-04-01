import * as uuidv4 from 'uuid';
import compareSets from '../../../common/utils/compareSets';
import {jsonToMessage, messageToJSON} from '../../../common/utils/wsMessage';
import {Settings} from '../models/settings';
import {notifyDetection} from './motionDetection';

const pingInterval = 10000;

export default class WsServer {
  private WS: any;
  private wss: any;
  private connectedDevices: any;
  private cachedMacMapStr: any;

  constructor(WS, wss) {
    this.WS = WS;
    this.wss = wss;
    this.connectedDevices = new Set();

    wss.on('connection', (ws) => {
      ws.id = uuidv4();
      ws.alive = true;
      ws.send(jsonToMessage('connectedToServer'));

      // on device connection
      if (ws.protocol.includes('device-')) {
        ws.type = 'device';
        this.handleDeviceConnection(ws);
      }
      // on ui connection
      if (ws.protocol.includes('ui-')) {
        ws.type = 'ui';
        this.handleUiConnection(ws);
      }
      // on message
      ws.on('message', (message) => {
        this.handleMessage(message, ws);
      });

      // ws.on('error', error => {
      // 	// error
      // });

      // ws.on('close', close => {
      // 	// close
      // });
    });

    setInterval(() => {
      const confirmedConnectedDevices = new Set();

      this.wss.clients.forEach((client) => {
        if (client.alive) {
          client.alive = false;
          client.send(''); // ping empty message

          if (client.type === 'device') {
            confirmedConnectedDevices.add(client.protocol);
          }
        } else {
          client.terminate();
        }
      });

      if (!compareSets(confirmedConnectedDevices, this.connectedDevices)) {
        this.connectedDevices = confirmedConnectedDevices;
        this.broadcast(null, jsonToMessage('connectedDevices', Array.from(this.connectedDevices)), 'ui');
      }
    }, pingInterval);
  }

  private broadcast(socket, msg, target?) {
    this.wss.clients.forEach((client) => {
      if (
        client.readyState !== this.WS.OPEN
        // if socket defined, exclude it from broadcasting
        || (socket && client.id === socket.id)
      ) {
        return;
      }

      if (
        // send to devices
        (target === 'devices' && client.type === 'device')
        // send to ui
        || (target === 'ui' && client.type === 'ui')
        // send to specific target
        || (target && client.id === target)
        // send to everyone
        || !target
      ) {
        client.send(msg);
      }
    });
  }

  private handleDeviceConnection(ws) {
    this.connectedDevices.add(ws.protocol);
    // send list of connected device to ui
    this.broadcast(null, jsonToMessage('connectedDevices', Array.from(this.connectedDevices)), 'ui');
  }

  private handleUiConnection(ws) {
    // send list of connected device to ui
    ws.send(jsonToMessage('connectedDevices', Array.from(this.connectedDevices)), 'ui');
    // currently device responds with stateUpdate on any message
    this.broadcast(null, jsonToMessage('newUiConnection'), 'devices');
  }

  private handleMessage(message, ws) {
    const [msgType, msgData] = messageToJSON(message);

    ws.alive = true;

    // handle state update
    if (msgType === 'stateUpdate') {
      // for now broadcast 'stateUpdate' to ui only
      this.broadcast(null, message, 'ui');

      if (msgData.state) {
        this.handleStateUpdate(msgData.state, ws);
      }
    } else if (msgType) {
      this.broadcast(ws, message);
    }
  }

  private async handleStateUpdate(state, ws) {
    // handle security new motion detection
    if (state.security && state.security.newDetection) {
      // handle notifications for each state key
      notifyDetection(state.security.lastDetected);
    }

    // handle someone home
    if (state.network) {
      if (
        state.security
        && JSON.stringify(Object.keys(state.network.macMap)) !== this.cachedMacMapStr
      ) {
        const settings = await Settings.find();
        const someoneHome = settings.some((s) => {
          return s.deviceIdentifiers.some((mac) => mac in state.network.macMap);
        });

        this.broadcast(null, jsonToMessage('someoneHome', someoneHome), ws.id);
      }

      this.cachedMacMapStr = JSON.stringify(Object.keys(state.network.macMap));
    }
  }
}
