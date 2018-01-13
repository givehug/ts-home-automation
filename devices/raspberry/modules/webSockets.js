const WS = require('ws');
const {messageToJSON} = require('./../utils/wsMessage');

/*
* WebSocket client module.
*/
class Sockets {
	constructor(options) {
		this.options = options;

		this.ws;
		this.connectionTimeput;
		this.reconnectInterval = 1000;

		this.send = this.send.bind(this);
	}

	/*
	* Start WebSocket client.
	*/
	start() {
		this.ws = new WS(this.options.port, 'device-' + this.options.deviceId);

		this.ws.on('message', msg => {
			// pong empty message
			if (msg === '') {
				return this.send('');
			}

			const [msgType, msgData] = messageToJSON(msg);

			if (this.options.onMessage) {
				if (this.options.onMessage[msgType]) {
					this.options.onMessage[msgType](this.send, msgData);
				} else if (this.options.onMessage.default) {
					this.options.onMessage.default(this.send, msgData);
				}
			}
		});

		this.ws.on('open', () => {
			console.log('WS Connected');
			this.cntTimeout && clearTimeout(this.cntTimeout);
		});

		this.ws.on('close', code => {
			console.log('WS Disconnected: ' + code);
			this.options.onClose && this.options.onClose();
			this.cntTimeout && clearTimeout(this.cntTimeout);
			this.cntTimeout = setTimeout(() => {
				this.start();
			}, this.reconnectInterval);
		});

		this.ws.on('error', error => {
			console.log('WS error: ' + error);
		});

		return Promise.resolve(this.ws);
	}

	/*
	* Send WS message.
	*/
	send(msg) {
		this.ws && this.ws.send(msg, err => {
			if (err) {
				this.start();
			}
		});
	}
}

module.exports = Sockets;
