import Vuex from 'vuex';
import Vue from 'vue';
import createLogger from 'vuex/dist/logger';

import app from './modules/app';
import user from './modules/user';
import users from './modules/users';
import devices from './modules/devices';
import settings from './modules/settings';
import robo, {roboMiddleware} from './modules/robo';
import ws, {wsMiddleware} from './modules/ws';
import home from './modules/home';
import * as constants from './constants';

Vue.use(Vuex);

// Plugins
const plugins = [roboMiddleware, wsMiddleware];

if (process.env.NODE_ENV === 'development') {
	const devPlugins = [createLogger()];

	plugins.push(...devPlugins);
}

// Modules
const modules = {
	app,
	user,
	users,
	devices,
	robo,
	ws,
	settings,
	home,
};

// Getters
const getters = {
	/**
	 * Is user at home. If one of user devices is connected to home network at the moment.
	 */
	[constants.getters.IS_USER_HOME]: state => userId => {
		if (!state.home.network.macMap) {
			return null;
		}

		const user = state.users.map[userId];
		const macIds = Object.keys(state.home.network.macMap);

		return user._id === userId && macIds.some(mId => user.deviceIdentifiers.includes(mId));
	},
};

// Create Store
const store = new Vuex.Store({
	modules,
	plugins,
	getters,
});

export default store;
