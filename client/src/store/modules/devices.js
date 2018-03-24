/**
 * Devices state is based on the list of devices that were added to database by user.
 * Actions inlcude fetching, adding new, deleting, updating device specs on server.
 * DEVICES_STATUS_UPDATE updates the state of particular device.
 * This mutation is initialized by websocket event of type 'stateUpdate'.
 */

import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state = {
	loading: false,
	loaded: false,
	list: [],
};

const getNewDeviceData = () => ({
	name: 'New device',
	type: '',
	description: 'No description',
});

const mutations = {
	/**
	 * Start fetching devices, set fetching devices status to true
	 */
	[constants.mutations.DEVICES_ASYNC_START](state) {
		state.loading = true;
	},
	/**
	 * Set fetching devices status to false when finished
	 */
	[constants.mutations.DEVICES_ASYNC_FINISH](state) {
		state.loading = false;
	},
	/**
	 * Fethced devices, update store with response
	 */
	[constants.mutations.DEVICES_FETCH_OK](state, list) {
		state.list = list;
		state.loaded = true;
	},
	/**
	 * Saved devices succesfully, update store
	 */
	[constants.mutations.DEVICES_SAVE_OK](state, device) {
		state.list = state.list.map(d => {
			return d._id === device._id ? Object.assign({}, d, device) : d;
		});
	},
	/**
	 * Added device succesfully on server, add it to store
	 */
	[constants.mutations.DEVICES_ADD_OK](state, device) {
		state.list = [...state.list, device];
	},
	/**
	 * Delete device succesfully from db, remove it from store
	 */
	[constants.mutations.DEVICES_DELETE_OK](state, id) {
		state.list = state.list.filter(d => d._id !== id);
	},
	/**
	 * Update device status with data from 'statusUpdate' WS event
	 */
	[constants.mutations.DEVICES_STATUS_UPDATE](state, activeDevices = []) {
		state.list = state.list.map(device => {
			const active = activeDevices.indexOf('device-' + device._id) > -1;

			return Object.assign({}, device, {active});
		});
	},
};

const actions = {
	/**
	 * Fetch list of all user devices
	 */
	[constants.actions.DEVICES_FETCH]: async(context) => {
		context.commit({type: constants.mutations.DEVICES_ASYNC_START});

		try {
			const res = await api.request(endpoints.devices, 'GET');

			context.commit(constants.mutations.DEVICES_FETCH_OK, res.data.devices);
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		} catch (error) {
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		}
	},
	/**
	 * Update existing device data on server
	 */
	[constants.actions.DEVICES_SAVE]: async(context, deviceData) => {
		context.commit(constants.mutations.DEVICES_ASYNC_START);

		try {
			const res = await api.request('devices/' + deviceData._id, 'PATCH', deviceData);

			context.commit(constants.mutations.DEVICES_SAVE_OK, res.data);
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		} catch (error) {
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		}
	},
	/**
	 * Add new device. It will be added with default data and will be given unique id on server.
	 */
	[constants.actions.DEVICES_ADD]: async(context) => {
		context.commit(constants.mutations.DEVICES_ASYNC_START);

		try {
			const res = await api.request('devices/', 'POST', getNewDeviceData());

			context.commit(constants.mutations.DEVICES_ADD_OK, res.data);
			context.dispatch(constants.actions.DEVICES_FETCH);
		} catch (error) {
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		}
	},
	/**
	 * Delete device by its id.
	 */
	[constants.actions.DEVICES_DELETE]: async(context, id) => {
		context.commit(constants.mutations.DEVICES_ASYNC_START);

		try {
			const res = await api.request('devices/' + id, 'DELETE');

			context.commit(constants.mutations.DEVICES_DELETE_OK, res.data.device._id);
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		} catch (error) {
			context.commit(constants.mutations.DEVICES_ASYNC_FINISH);
		}
	},
};

const getters = {
	/**
	 * Find device by id in store.
	 */
	[constants.getters.DEVICES_GET_BY_ID]: (state) => (id) => {
		return state.list.find(d => d._id === id);
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
