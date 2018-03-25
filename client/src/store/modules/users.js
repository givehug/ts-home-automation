import Vue from 'vue';
import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state = {map: {}};

const mutations = {
	[constants.mutations.USERS_MAP_UPDATE](state, map) {
		state.map = map;
	},
	[constants.mutations.USERS_MAP_ADD](state, {userId, userData}) {
		Vue.set(state.map, userId, userData);
	},
	[constants.mutations.USERS_MAP_REMOVE](state, userId) {
		Vue.delete(state.map, userId);
	},
};

const actions = {
	[constants.actions.USERS_INVITE]: async(context, {email, name}) => {
		try {
			const res = await api.request(endpoints.users, 'POST', {
				email,
				name,
			});

			context.commit(constants.mutations.USERS_MAP_ADD, {
				userId: res.data,
				userData: {
					email,
					name,
					_id: res.data,
					deviceIdentifiers: [],
				}
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
