// Import modules
import annyang from 'annyang'; // only chrome and some android
import deviceCommands from '../../../../common/data/deviceCommands';
import SpeechSynthesisUtterance from '../../../../common/utils/speechSynthesis';
import * as types from '../types';

// Import interfaces
import {RootState, RoboState, RoboEmotions} from '@/../../common/@types/store';
import {Store, ActionContext, MutationPayload} from 'vuex';


const initialState: RoboState = {
  annyangAvailable: false,
  name: 'Robby',
  langs: ['en-US', 'ru-RU'],
  lang: 'en-US',
  emotions: {
    mouthOpen: false,
    eyesClosed: false,
    weird: false,
    moveEyes: true,
    talking: false,
  },
};

const mutations = {
  /**
   * Initialize annyang.
   */
  [types.mutations.ROBO_INIT](state: RoboState) {
    state.annyangAvailable = !!annyang;
  },
  /**
   * Stop annyang.
   */
  [types.mutations.ROBO_STOP]() { /* Used in roboMiddleware */ },
  /**
   * Robot say message.
   */
  [types.mutations.ROBO_SAY](state: RoboState, msg: any) { /* Used in roboMiddleware */ },
  /**
   * Change robot face expression.
   */
  [types.mutations.ROBO_EMOTION_CHANGE](state: RoboState, emotions: object) {
    state.emotions = {...state.emotions, ...emotions};
  },
  /**
   * Pause annyang.
   */
  [types.mutations.ROBO_PAUSE]() { /* Used in roboMiddleware */ },
  /**
   * Pause annyang after it was paused.
   */
  [types.mutations.ROBO_RESUME]() { /* Used in roboMiddleware */ },
};

const actions = {
  /**
   * Turn annyang on/off. Save it on server in user settings.
   */
  [types.actions.ROBO_TOGGLE](context: ActionContext<RoboState, RootState>) {
    const annyangActive = context.rootState.settings.data.annyangActive;

    if (annyangActive) {
      context.commit(types.mutations.ROBO_PAUSE);
    } else {
      context.commit(types.mutations.ROBO_RESUME);
    }

    context.dispatch(types.actions.SETTINGS_SAVE, {annyangActive: !annyangActive});
  },
};

const getters = {
  /**
   * Returns robot face expression css classes string.
   */
  [types.getters.ROBO_EMOTIONS_STRING]: (state: RoboState) => {
    return Object
      .keys(state.emotions)
      .reduce((p, c) => state.emotions[c] ? p + ' ' + c : p, '');
  },
};

export const roboMiddleware = (store: Store<RootState>) => {
  if (!annyang) {
    /**
     * Annyang works by using the webkitSpeechRecognition API,
     * which is currently only available in Chrome.
     */
    return;
  }

  const commands = {
    /**
     * Hello command.
     * Simply respond with hello.
     */
    'hello': () => {
      store.commit(types.mutations.ROBO_SAY, 'Hi! How can I help?');
    },
    /**
     * Please execute command from store.commands map.
     * Send WS device command event.
     */
    'please *commandTitle': (commandTitle: string) => {
      const command = deviceCommands.byTitle[commandTitle];

      if (command) {
        store.commit(types.mutations.ROBO_SAY, 'executing');
        store.commit(types.mutations.WS_MESSAGE_SEND, ['deviceCommand', {cmdId: command.key}]);
      } else {
        store.commit(types.mutations.ROBO_SAY, 'sorry, unknown command');
      }
    },
  };

  store.subscribe((mutation: MutationPayload) => {
    switch (mutation.type) {
      /**
       * On ROBO_INIT start anyang and populate it with predefined commands.
       */
      case types.mutations.ROBO_INIT:
        if (annyang && !annyang.isListening()) {
          annyang.addCommands(commands);
          annyang.start({
            autoRestart: true,
            continuous: false,
          });
          if (process.env.NODE_ENV === 'development') {
            annyang.debug();
          }
        }
        if (!store.state.settings.data.annyangActive) {
          store.commit(types.mutations.ROBO_PAUSE);
        }
        break;
      /**
       * Stop robot.
       */
      case types.mutations.ROBO_STOP:
        annyang.abort();
        break;
      /**
       * On ROBO_SAY check speach API, say something and change face expression.
       */
      case types.mutations.ROBO_SAY: {
        if (!SpeechSynthesisUtterance) {
          break;
        }

        annyang.pause();
        (window as any).utterances = [];
        const speach = new SpeechSynthesisUtterance(mutation.payload);

        (window as any).utterances.push(speach);

        speach.onstart = () => {
          store.commit(types.mutations.ROBO_EMOTION_CHANGE, {
            talking: true,
            moveEyes: false,
          });
        };

        speach.onend = () => {
          annyang.resume();
          store.commit(types.mutations.ROBO_EMOTION_CHANGE, {
            talking: false,
            moveEyes: true,
          });
        };

        speechSynthesis.speak(speach);
        break;
      }
      /**
       * Pause robot.
       */
      case types.mutations.ROBO_PAUSE:
        annyang.pause();
        break;
      /**
       * Resume robot.
       */
      case types.mutations.ROBO_RESUME:
        annyang.resume();
        break;

      default:
        break;
    }
  });
};

export default {
  state: initialState,
  actions,
  mutations,
  getters,
};
