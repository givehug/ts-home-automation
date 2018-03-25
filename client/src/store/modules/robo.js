import annyang from 'annyang'; // only chrome and some android
import SpeechSynthesisUtterance from './../../../../utils/speechSynthesis';
import * as constants from './../constants';

const state = {
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
	 * Used in roboMiddleware.
	 */
	[constants.mutations.ROBO_INIT](state) {
		state.annyangAvailable = !!annyang;
	},
	/**
	 * Stop annyang.
	 * Used in roboMiddleware.
	 */
	[constants.mutations.ROBO_STOP]() { /* do nothing */ },
	/**
	 * Robot say message.
	 * Used in roboMiddleware.
	 */
	[constants.mutations.ROBO_SAY](state, msg) { /* do nothing */ },
	/**
	 * Change robot face expression.
	 */
	[constants.mutations.ROBO_EMOTION_CHANGE](state, emotions) {
		state.emotions = Object.assign({}, state.emotions, emotions);
	},
	/**
	 * Pause annyang.
	 * Used in roboMiddleware.
	 */
	[constants.mutations.ROBO_PAUSE]() { /* do nothing */ },
	/**
	 * Pause annyang after it was paused.
	 * Used in roboMiddleware.
	 */
	[constants.mutations.ROBO_RESUME]() { /* do nothing */ },
};

const actions = {
	/**
	 * Turn annyang on/off. Save it on server in user settings.
	 */
	[constants.actions.ROBO_TOGGLE](context) {
		const annyangActive = context.rootState.settings.data.annyangActive;

		if (annyangActive) {
			context.commit(constants.mutations.ROBO_PAUSE);
		} else {
			context.commit(constants.mutations.ROBO_RESUME);
		}

		context.dispatch(constants.actions.SETTINGS_SAVE, {annyangActive: !annyangActive});
	},
};

const getters = {
	/**
	 * Returns robot face expression css classes string.
	 */
	[constants.getters.ROBO_GET_EMOTIONS_STRING]: (state) => {
		return Object
			.keys(state.emotions)
			.reduce((p, c) => state.emotions[c] ? p + ' ' + c : p, '');
	},
};

export const roboMiddleware = (store) => {
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
			store.commit(constants.mutations.ROBO_SAY, 'Hi! How can I help?');
		},
		/**
		 * Please execute command from store.commands map.
		 * Execute WS device command event.
		 */
		'please *commandTitle': (commandTitle) => {
			const command = store.state.commands.byTitle[commandTitle];

			if (command) {
				store.commit(constants.mutations.ROBO_SAY, 'executing');
				store.commit(constants.mutations.WS_MESSAGE_SEND, ['deviceCommand', {cmdId: command.key}]);
			} else {
				store.commit(constants.mutations.ROBO_SAY, 'sorry, unknown command');
			}
		},
	};

	store.subscribe((mutation) => {
		switch (mutation.type) {
			/**
			 * On ROBO_INIT start anyang and populate it with predefined commands.
			 */
			case constants.mutations.ROBO_INIT:
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
					store.commit(constants.mutations.ROBO_PAUSE);
				}
				break;
			/**
			 * Stop robot.
			 */
			case constants.mutations.ROBO_STOP:
				annyang.abort();
				break;
			/**
			 * On ROBO_SAY check speach API, say something and change face expression.
			 */
			case constants.mutations.ROBO_SAY: {
				if (!SpeechSynthesisUtterance) {
					break;
				}

				annyang.pause();
				window.utterances = [];
				const speach = new SpeechSynthesisUtterance(mutation.payload);

				window.utterances.push(speach);

				speach.onstart = () => {
					store.commit(constants.mutations.ROBO_EMOTION_CHANGE, {
						talking: true,
						moveEyes: false,
					});
				};

				speach.onend = () => {
					annyang.resume();
					store.commit(constants.mutations.ROBO_EMOTION_CHANGE, {
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
			case constants.mutations.ROBO_PAUSE:
				annyang.pause();
				break;
			/**
			 * Resume robot.
			 */
			case constants.mutations.ROBO_RESUME:
				annyang.resume();
				break;

			default:
				break;
		}
	});
};

export default {
	state,
	actions,
	mutations,
	getters,
};
