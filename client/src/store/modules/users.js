import keyBy from 'lodash/keyBy';
import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state = {map: {}};

const mutations = {
	[constants.mutations.USERS_MAP_UPDATE](state, map) {
		state.map = map;
	},
	[constants.mutations.USERS_MAP_ADD](state, userId, userData) {
		state.map[userId] = userData;
	},
	[constants.mutations.USERS_MAP_REMOVE](state, userId) {
		delete state.map[userId];
	},
};

const actions = {
	[constants.actions.USERS_FETCH]: async(context) => {
		const res = await api.request(endpoints.users, 'GET');

		context.commit(constants.mutations.USERS_MAP_UPDATE, keyBy(res.data, '_id'));
	},
	[constants.actions.USERS_INVITE]: async(context, {email, name}) => {
		try {
			debugger;
			const res = await api.request(endpoints.users, 'POST', {
				email,
				name,
			});
			debugger;

			context.commit(constants.mutations.USERS_MAP_ADD, res.data, {
				email,
				name,
				_id: res.data,
			});

			return true;
		} catch (error) {
			return false;
		}
	},
	[constants.actions.USERS_DELETE]: async(context, userId) => {
		try {
			await api.request(endpoints.users + userId, 'DELETE');

			context.commit(constants.mutations.USERS_MAP_REMOVE, userId);

			return true;
		} catch (error) {
			return false;
		}
	},
};

export default {
	state,
	mutations,
	actions,
};
