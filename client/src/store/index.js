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
import commands from './modules/commands';
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
	commands,
};

// Getters
const getters = {
	/**
	 * Is user at home. If one of user devices is connected to home network at the moment.
	 */
	[constants.getters.IS_USER_HOME]: state => userId => {
		if (!state.home.network.macMap || !state.users.list) {
			return null;
		}

		return state.users.list.find(u => {
			const macIds = Object.keys(state.home.network.macMap);

			return u._id === userId && macIds.some(mId => u.macs.indexOf(mId) > -1);
		});
	},
	/**
	 * Check if user has admin permissions.
	 */
	[constants.getters.IS_USER_ADMIN]: state => userId => {
		return !!(state.users.list && state.users.list.find(u => u._id === userId && u.admin));
	},
};

// Create Store
const store = new Vuex.Store({
	modules,
	plugins,
	getters,
});

export default store;
