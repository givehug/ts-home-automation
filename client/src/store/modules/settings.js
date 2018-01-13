// @flow

/**
 * Settings state has main object 'data' where all user settings are stored.
 * We load settings from server, update them on client side, save updates to server.
 */

import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state: SettingsStateType = {
	loaded: false,
	data: {},
};

const mutations = {
	/**
	 * Update settings state in store
	 */
	[constants.mutations.SETTINGS_UPDATE](state: SettingsStateType, settings: any) {
		state.data = {
			...state.data,
			...settings,
		};
		state.loaded = true;
	},
};

const actions = {
	/**
	 * Load settings from server
	 */
	[constants.actions.SETTINGS_LOAD]: async(context: any) => {
		try {
			const res = await api.request(endpoints.settings, 'GET');

			context.commit(constants.mutations.SETTINGS_UPDATE, res.data.settings);
		} catch (error) {
			// do nothing
		}
	},
	/**
	 * Save settings on server
	 */
	[constants.actions.SETTINGS_SAVE]: (context: any, settings: any) => {
		context.commit(constants.mutations.SETTINGS_UPDATE, settings);

		const settingsData = context.rootState.settings.data;

		api.request(endpoints.settings, 'PATCH', {settings: settingsData});
	},
};

export default {
	state,
	mutations,
	actions,
};
