import config from '../../../../config';
import {jsonToMessage, messageToJSON} from './../../../../common/utils/wsMessage';
import * as constants from './../constants';

const mutations = {
  [constants.mutations.WS_CONNECT]() { /* do nothing */ },
  [constants.mutations.WS_CONNECTED]() { /* do nothing */ },
  [constants.mutations.WS_DISCONNECT]() { /* do nothing */ },
  [constants.mutations.WS_DISCONNECTED]() { /* do nothing */ },
  [constants.mutations.WS_MESSAGE_SEND](state, payload) { /* do nothing */ },
  [constants.mutations.WS_MESSAGE_SENT]() { /* do nothing */ },
  [constants.mutations.WS_MESSAGE_RECEIVED]() { /* do nothing */ },
};

export default {mutations};

export const wsMiddleware = (store) => {
  const hostname = config.WS_URL;
  let socket: any;

  const onMessage = (evt) => {
    const msg = evt.data;
    const [msgType, msgData] = messageToJSON(msg);

    store.commit(constants.mutations.WS_MESSAGE_RECEIVED);

    if (!store.getters[constants.getters.AM_I_AUTHED]) {
      store.commit(constants.mutations.WS_DISCONNECT);
    }

    if (msg === '') {
      return socket && socket.send(''); // pong empty message
    }

    switch (msgType) {
      case 'connectedDevices':
        store.commit(constants.mutations.DEVICES_ACTIVE_UPDATE, msgData);
        break;

      case 'stateUpdate':
        store.commit(constants.mutations.HOME_STATE_UPDATE, msgData && (msgData as any).state);
        break;

      default:
        break;
    }
  };

  store.subscribe((mutation) => {
    switch (mutation.type) {
      case constants.mutations.WS_CONNECT:
        if (socket) {
          socket.close();
        }
        socket = new WebSocket(hostname, 'ui-' + store.state.user.token);
        socket.onmessage = onMessage;
        socket.onclose = () => store.commit(constants.mutations.WS_DISCONNECTED);
        socket.onopen = () => store.commit(constants.mutations.WS_CONNECTED);
        break;

      case constants.mutations.WS_DISCONNECT:
        if (socket) {
          socket.close();
        }
        socket = void 0;
        store.commit(constants.mutations.WS_DISCONNECTED);
        break;

      case constants.mutations.WS_DISCONNECTED:
        // setTimeout(() => { // TODO what about logging out?
        // 	store.commit(constants.mutations.WS_CONNECT);
        // }, 5000);
        break;

      case constants.mutations.WS_MESSAGE_SEND:
        if (socket) {
          socket.send(jsonToMessage(...mutation.payload));
        }
        store.commit(constants.mutations.WS_MESSAGE_SENT);
        break;

      default:
        break;
    }
  });
};
