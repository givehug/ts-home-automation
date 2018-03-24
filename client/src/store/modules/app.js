/**
 * App state only stores some application meta data.
 * Single action is used to initialize application,
 * which means fetch all necessary data and initialize other components.
 */

import * as constants from './../constants';

const state = {deviceTypes: ['espruino', 'raspberry pi 3']};

const actions = {
	/**
	 * If user auth token is in local storage, get user data by it,
	 * fetch all other necessary data and init components available for signe in user.
	 */
	[constants.actions.APP_INIT]: async(context) => {
		const token = localStorage.getItem('token');

		if (token) {
			context.commit(constants.mutations.USER_TOKEN_SET, token);

			try {
				try {
					// try fetching user data with token from localStorage
					await context.dispatch(constants.actions.USER_DATA_FETCH);
				} catch (error) {
					// token might be expired
					context.dispatch(constants.actions.USER_LOGOUT);

					return;
				}

				await Promise.all([
					context.dispatch(constants.actions.USERS_FETCH),
					context.dispatch(constants.actions.DEVICES_FETCH),
					context.dispatch(constants.actions.SETTINGS_LOAD),
				]);
				context.commit(constants.mutations.ROBO_INIT);
				context.commit(constants.mutations.WS_CONNECT);
			} catch (error) {
				// console.error('APP async error');
			}
		}
	},
};

export default {
	state,
	actions,
};
