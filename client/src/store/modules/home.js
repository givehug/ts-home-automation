/**
 * 'home' state represents state of all smart home devices and units.
 * Currently it includes raspberry pi 3 device,
 * which handles network and security units and simple nodemcu led bulb.
 */

import * as constants from './../constants';

const state = {
	/**
	 * 'network' state represents state of home wifi network and connected devices at the moment.
	 * (a few minutes delay possible)
	 * It also defines which user is home or away.
	 * 'user' state has 'deviceIdentifiers' array of devices id which represent user.
	 * If one of this devices is in  'network.macMap',
	 * this means that user is home, otherwise he is away.
	 */
	network: {macMap: {}}, // map of currently connected mac addresses
	/**
	 * 'security' state.
	 * If detectionStatus is on, when motion is detected,
	 * pciture is taken and email notification is sent to user.
	 * Image can be taken on demand by user command at any time.
	 */
	security: {
		detectionStatus: null, // whether motion detector is ON or OFF
		lastDetected: null, // last motion detection date and time
		images: null, // list of recent images taken
		turnDetectionOnWhenNobodyHome: null,
	},
	/**
	 * Simple LED bulb state.
	 */
	led: null,
};

const mutations = {
	/**
	 * Update particular 'home' state property values
	 */
	[constants.mutations.HOME_STATE_UPDATE](state, update) {
		Object.keys(update).forEach(key => {
			state[key] = update[key];
		});
	},
};

export default {
	state,
	mutations,
};
