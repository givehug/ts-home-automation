const {messageToJSON, jsonToMessage} = require('./../../utils/wsMessage');
const compareSets = require('./../../utils/compareSets');
const {notifyDetection} = require('./motionDetection');
const {User} = require('./../models/user');
const uuidv4 = require('uuid/v4');

const pingInterval = 10000;

class WsServer {
	constructor(WS, wss) {
		this.WS = WS;
		this.wss = wss;
		this.connectedDevices = new Set();
		this.cachedMacMapStr;

		wss.on('connection', ws => {
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

			this.wss.clients.forEach(client => {
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

	broadcast(socket, msg, target) {
		this.wss.clients.forEach(client => {
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

	handleDeviceConnection(ws) {
		this.connectedDevices.add(ws.protocol);
		// send list of connected device to ui
		this.broadcast(null, jsonToMessage('connectedDevices', Array.from(this.connectedDevices)), 'ui');
	}

	handleUiConnection(ws) {
		// send list of connected device to ui
		ws.send(jsonToMessage('connectedDevices', Array.from(this.connectedDevices)), 'ui');
		// currently device responds with stateUpdate on any message
		this.broadcast(null, jsonToMessage('newUiConnection'), 'devices');
	}

	handleMessage(message, ws) {
		const [msgType, msgData] = messageToJSON(message);

		ws.alive = true;

		// handle state update
		if (msgType === 'stateUpdate') {
			// for now broadcast 'stateUpdate' to ui only
			this.broadcast(null, message, 'ui');
			msgData.state && this.handleStateUpdate(msgData.state, ws);
		} else if (msgType) {
			this.broadcast(ws, message);
		}
	}

	async handleStateUpdate(state, ws) {
		// handle security new motion detection
		if (state.security && state.security.newDetection) {
			// handle notifications for each state key
			notifyDetection(state.security.lastDetected);
		}

		// hande someone home
		if (state.network) {
			if (
				state.security
				&& JSON.stringify(Object.keys(state.network.macMap)) !== this.cachedMacMapStr
			) {
				const users = await User.find();
				const someoneHome = users.some(user => {
					return user.macs.some(deviceMac => deviceMac in state.network.macMap);
				});

				this.broadcast(null, jsonToMessage('someoneHome', someoneHome), ws.id);
			}

			this.cachedMacMapStr = JSON.stringify(Object.keys(state.network.macMap));
		}
	}
}

module.exports = WsServer;
