/**
 * Devices state is based on the map of devices that were added to database by user.
 * Actions inlcude fetching, adding new, deleting, updating device specs on server.
 * DEVICES_ACTIVE_UPDATE updates the state of particular device.
 * This mutation is initialized by websocket event of type 'stateUpdate'.
 */

import Vue from 'vue';
import {api, endpoints} from './../../api';
import * as constants from './../constants';

const state = {
	map: {},
	activeDevices: [],
};

const getNewDeviceData = () => ({
	name: 'New device',
	type: '',
	description: 'No description',
});

const mutations = {
	/**
	 * Fethced devices, update store with response
	 */
	[constants.mutations.DEVICES_MAP_UPDATE](state, map) {
		state.map = map;
	},
	/**
	 * Saved devices succesfully, update store
	 */
	[constants.mutations.DEVICES_SAVE_OK](state, device) {
		Vue.set(state.map, device._id, Object.assign({}, state.map[device._id], device));
	},
	/**
	 * Added device succesfully on server, add it to store
	 */
	[constants.mutations.DEVICES_ADD_OK](state, device) {
		Vue.set(state.map, device._id, device);
	},
	/**
	 * Delete device succesfully from db, remove it from store
	 */
	[constants.mutations.DEVICES_DELETE_OK](state, deviceId) {
		Vue.delete(state.map, deviceId);
	},
	/**
	 * Update list of active devices
	 */
	[constants.mutations.DEVICES_ACTIVE_UPDATE](state, activeDevices = []) {
		state.activeDevices = activeDevices.map(id => id.replace(/device-/, ''));
	},
};

const actions = {
	/**
	 * Update existing device data on server
	 */
	[constants.actions.DEVICES_SAVE]: async(context, deviceData) => {
		await api.request(endpoints.devices + deviceData._id, 'PATCH', deviceData);
		context.commit(constants.mutations.DEVICES_SAVE_OK, deviceData);
	},
	/**
	 * Add new device. It will be added with default data and will be given unique id on server.
	 */
	[constants.actions.DEVICES_ADD]: async(context) => {
		const res = await api.request(endpoints.devices, 'POST', getNewDeviceData());
		context.commit(constants.mutations.DEVICES_ADD_OK, res.data);
	},
	/**
	 * Delete device by its id.
	 */
	[constants.actions.DEVICES_DELETE]: async(context, id) => {
		const res = await api.request(endpoints.devices + id, 'DELETE');
		context.commit(constants.mutations.DEVICES_DELETE_OK, res.data.device._id);
	},
};

const getters = {
	/**
	 * Test if device is active
	 */
	[constants.getters.IS_DEVICE_ACTIVE]: state => deviceId => {
		return state.activeDevices.includes(deviceId);
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
