import * as WS from 'ws';
import wsMessage from '../../../../common/utils/wsMessage';

/*
* WebSocket client module.
*/
export default class Sockets {
  options;
  ws;
  reconnectInterval = 1000;

  constructor(options) {
    this.options = options;
    this.ws;
    this.reconnectInterval = 1000;
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

      const [msgType, msgData] = wsMessage.parse(msg);

      if (this.options.onMessage) {
        if (this.options.onMessage[msgType]) {
          this.options.onMessage[msgType](m => this.send(m), msgData);
        } else if (this.options.onMessage.default) {
          this.options.onMessage.default(m => this.send(m), msgData);
        }
      }
    });

    this.ws.on('open', () => {
      console.log('WS Connected');
    });

    this.ws.on('close', code => {
      console.log('WS Disconnected: ' + code);
      setTimeout(() => {
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
    this.ws && this.ws.send(msg);
  }
}
