import {USER_SESSION_TOKEN} from '../../data/constants';
import {endpoints, request} from './../../api';
import router from './../../router';
import * as constants from './../constants';

const state = {
	token: null,
	data: null,
};

const mutations = {
	/**
	 * Save user token to localStorage.
	 */
	[constants.mutations.USER_TOKEN_SET](state, token) {
		state.token = token;
		localStorage.setItem(USER_SESSION_TOKEN, token);
	},
	/**
	 * Remove user token from localStorage.
	 */
	[constants.mutations.USER_TOKEN_CLEAR](state) {
		state.token = null;
		localStorage.removeItem(USER_SESSION_TOKEN);
	},
	/**
	 * Clear user data.
	 */
	[constants.mutations.USER_DATA_CLEAR](state) {
		state.data = null;
	},
	/**
	 * Update user data.
	 */
	[constants.mutations.USER_DATA_UPDATE](state, data) {
		state.data = Object.assign({}, state.data, data);
	},
	/**
	 * Initially set user data.
	 */
	[constants.mutations.USER_DATA_SET](state, data) {
		state.data = data;
	},
};

const actions = {
	/**
	 * Patch user data on server.
	 */
	[constants.actions.USER_DATA_PATCH]: async(context, update) => {
		if (!update) {
			return;
		}

		try {
			await request(endpoints.userMe, 'PATCH', {update});
			context.commit(constants.mutations.USER_DATA_UPDATE, update);

			return true;
		} catch (error) {
			return false;
		}
	},
	/**
	 * Add (invite) new user.
	 */
	[constants.actions.USER_ADD]: async(context, form) => {
		try {
			const res = await request(endpoints.users, 'POST', form);

			context.commit(constants.mutations.USER_TOKEN_SET, res.headers['x-auth']);
			context.dispatch(constants.actions.APP_INIT);

			return true;
		} catch (error) {
			return error.response.data;
		}
	},
	/**
	 * Log in.
	 */
	[constants.actions.USER_LOGIN]: async(context, {email, password}) => {
		try {
			const res = await request(endpoints.userLogin, 'POST', {email, password});

			context.commit(constants.mutations.USER_TOKEN_SET, res.headers['x-auth']);
			context.dispatch(constants.actions.APP_INIT);

			return true;
		} catch (error) {
			// do nothing
		}
	},
	/**
	 * Log out.
	 */
	[constants.actions.USER_LOGOUT]: async(context) => {
		try {
			await request(endpoints.userLogout, 'DELETE');
		} catch (error) {
			// do nothing
		}
		context.commit(constants.mutations.ROBO_STOP);
		context.commit(constants.mutations.WS_DISCONNECT);
		context.commit(constants.mutations.USER_TOKEN_CLEAR);
		context.commit(constants.mutations.USER_DATA_CLEAR);
		router.push('/');
	},
};

const getters = {
	/**
	 * Check if current user is authorized.
	 */
	[constants.getters.AM_I_AUTHED]: (state) => !!state.token,
	/**
	 * Check if user is admin.
	 */
	[constants.getters.AM_I_ADMIN]: (state) => !!(state.data && state.data.admin),
};

export default {
	state,
	mutations,
	actions,
	getters,
};
