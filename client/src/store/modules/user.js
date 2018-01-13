// @flow
import {api, endpoints} from './../../api';
import router from './../../router';
import * as constants from './../constants';

const state: UserStateType = {
	token: null,
	data: null,
};

const mutations = {
	/**
	 * Save user token to localStorage.
	 */
	[constants.mutations.USER_TOKEN_SET](state: UserStateType, token: string) {
		state.token = token;
		localStorage.setItem('token', token);
	},
	/**
	 * Remove user token from localStorage.
	 */
	[constants.mutations.USER_TOKEN_CLEAR](state: UserStateType) {
		state.token = null;
		localStorage.removeItem('token');
	},
	/**
	 * Clear user data.
	 */
	[constants.mutations.USER_DATA_CLEAR](state: UserStateType) {
		state.data = null;
	},
	/**
	 * Update user data.
	 */
	[constants.mutations.USER_DATA_UPDATE](state: UserStateType, data: any) {
		state.data = {
			...state.data,
			...data,
		};
	},
	/**
	 * Initially set user data.
	 */
	[constants.mutations.USER_DATA_SET](state: UserStateType, data: any) {
		state.data = data;
	},
};

const actions = {
	/**
	 * Fetch user data from server.
	 */
	[constants.actions.USER_DATA_FETCH]: async(context: any) => {
		if (!context.getters[constants.getters.AM_I_AUTHED]) {
			return;
		}

		try {
			const res = await api.request(endpoints.userMe, 'GET');

			context.commit(constants.mutations.USER_DATA_SET, res.data);
		} catch (error) {
			context.dispatch(constants.actions.USER_LOGOUT);
		}
	},
	/**
	 * Patch user data on server.
	 */
	[constants.actions.USER_DATA_PATCH]: async(context: any, update: any) => {
		if (!update) {
			return;
		}

		try {
			await api.request(endpoints.userMe, 'PATCH', {update});
			context.commit(constants.mutations.USER_DATA_UPDATE, update);

			return true;
		} catch (error) {
			return false;
		}
	},
	/**
	 * Add (invite) new user.
	 */
	[constants.actions.USER_ADD]: async(context: any, form: any) => {
		try {
			const res = await api.request(endpoints.users, 'POST', form);

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
	[constants.actions.USER_LOGIN]: async(context: any, {email, password}: {email: string, password: string}) => {
		try {
			const res = await api.request(endpoints.userLogin, 'POST', {email, password});

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
	[constants.actions.USER_LOGOUT]: async(context: any) => {
		try {
			await api.request(endpoints.userLogout, 'DELETE');
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
	[constants.getters.AM_I_AUTHED]: (state: UserStateType): boolean => !!state.token,
	/**
	 * Check if user is admin.
	 */
	[constants.getters.AM_I_ADMIN]: (state: UserStateType): boolean => !!(state.data && state.data.admin),
};

export default {
	state,
	mutations,
	actions,
	getters,
};
