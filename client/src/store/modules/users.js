// @flow
import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state: UsersStateType = {list: null};

const mutations = {
	[constants.mutations.USERS_LIST_UPDATE](state: UsersStateType, list: Array<UserDataType>) {
		state.list = list;
	},
	[constants.mutations.USERS_LIST_ADD](state: UsersStateType, user: UserDataType) {
		state.list = state.list ? [...state.list, user] : [user];
	},
	[constants.mutations.USERS_LIST_REMOVE](state: UsersStateType, userId: string) {
		state.list = state.list ? state.list.filter(u => u._id !== userId) : state.list;
	},
};

const actions = {
	[constants.actions.USERS_FETCH]: async(context: any) => {
		try {
			const res = await api.request(endpoints.users, 'GET');

			context.commit(constants.mutations.USERS_LIST_UPDATE, res.data);
		} catch (error) {
			// do nothing
		}
	},
	[constants.actions.USERS_INVITE]: async(context: any, {email, name}: {email: string, name: string}) => {
		try {
			const res = await api.request(endpoints.users, 'POST', {
				email,
				name,
			});

			context.commit(constants.mutations.USERS_LIST_ADD, {
				email,
				name,
				macs: [],
				_id: res.data,
			});

			return true;
		} catch (error) {
			return false;
		}
	},
	[constants.actions.USERS_DELETE]: async(context: any, userId: string) => {
		try {
			await api.request(endpoints.users + userId, 'DELETE');

			context.commit(constants.mutations.USERS_LIST_REMOVE, userId);

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
