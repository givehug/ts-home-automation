// Import modules
import config from '@/../../config';
import wsMsg from '@/../../common/utils/wsMessage';
import * as types from '@/store/types';

// Import interfaces
import {RootState} from '@/../../common/@types/store';
import {Store, MutationPayload} from 'vuex';


const mutations = {
  [types.mutations.WS_CONNECT]() { /* do nothing */ },
  [types.mutations.WS_CONNECTED]() { /* do nothing */ },
  [types.mutations.WS_DISCONNECT]() { /* do nothing */ },
  [types.mutations.WS_DISCONNECTED]() { /* do nothing */ },
  [types.mutations.WS_MESSAGE_SEND](state: {}, payload: any) { /* do nothing */ },
  [types.mutations.WS_MESSAGE_SENT]() { /* do nothing */ },
  [types.mutations.WS_MESSAGE_RECEIVED]() { /* do nothing */ },
};

export default {mutations};

export const wsMiddleware = (store: Store<RootState>) => {
  const hostname = config.WS_URL;
  let socket: any;

  const onMessage = (evt: any) => {
    const msg = evt.data;
    const [msgType, msgData] = wsMsg.parse(msg);

    store.commit(types.mutations.WS_MESSAGE_RECEIVED);

    if (!store.getters[types.getters.IS_AUTHED]) {
      store.commit(types.mutations.WS_DISCONNECT);
    }

    if (msg === '') {
      return socket && socket.send(''); // pong empty message
    }

    switch (msgType) {
      case 'connectedDevices':
        store.commit(types.mutations.DEVICES_ACTIVE_UPDATE, msgData);
        break;

      case 'stateUpdate':
        store.commit(types.mutations.HOME_STATE_UPDATE, msgData && (msgData as any).state);
        break;

      default:
        break;
    }
  };

  store.subscribe((mutation: MutationPayload) => {
    switch (mutation.type) {
      case types.mutations.WS_CONNECT:
        if (socket) {
          socket.close();
        }
        socket = new WebSocket(hostname, 'ui-' + store.state.user.token);
        socket.onmessage = onMessage;
        socket.onclose = () => store.commit(types.mutations.WS_DISCONNECTED);
        socket.onopen = () => store.commit(types.mutations.WS_CONNECTED);
        break;

      case types.mutations.WS_DISCONNECT:
        if (socket) {
          socket.close();
        }
        socket = void 0;
        store.commit(types.mutations.WS_DISCONNECTED);
        break;

      case types.mutations.WS_DISCONNECTED:
        // setTimeout(() => { // TODO what about logging out?
        // 	store.commit(types.mutations.WS_CONNECT);
        // }, 5000);
        break;

      case types.mutations.WS_MESSAGE_SEND:
        if (socket) {
          socket.send(wsMsg.prep(mutation.payload[0], mutation.payload[1]));
        }
        store.commit(types.mutations.WS_MESSAGE_SENT);
        break;

      default:
        break;
    }
  });
};
