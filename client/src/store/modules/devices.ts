/**
 * Devices state is based on the map of devices that were added to database by user.
 * Actions inlcude fetching, adding new, deleting, updating device specs on server.
 * DEVICES_ACTIVE_UPDATE updates list currently connected devices.
 * This mutation is initialized by websocket event of type 'stateUpdate'.
 */

// Import modules
import Vue from 'vue';
import {endpoints, request} from '@/api';
import * as types from '@/store/types';

// Import interfaces
import {RootState, DevicesState, DevicesMap, DeviceData} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';


const initialState: DevicesState = {
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
  [types.mutations.DEVICES_MAP_UPDATE](state: DevicesState, map: DevicesMap) {
    state.map = map;
  },
  /**
   * Saved devices succesfully, update store
   */
  [types.mutations.DEVICES_SAVE_OK](state: DevicesState, device: DeviceData) {
    Vue.set(state.map, device._id, {...state.map[device._id], ...device});
  },
  /**
   * Added device succesfully on server, add it to store
   */
  [types.mutations.DEVICES_ADD_OK](state: DevicesState, device: DeviceData) {
    Vue.set(state.map, device._id, device);
  },
  /**
   * Delete device succesfully from db, remove it from store
   */
  [types.mutations.DEVICES_DELETE_OK](state: DevicesState, deviceId: string) {
    Vue.delete(state.map, deviceId);
  },
  /**
   * Update list of active devices
   */
  [types.mutations.DEVICES_ACTIVE_UPDATE](state: DevicesState, activeDevices: string[] = []) {
    state.activeDevices = activeDevices.map((id: string) => id.replace(/device-/, ''));
  },
};

const actions = {
  /**
   * Update existing device data on server
   */
  [types.actions.DEVICES_SAVE]: async (context: ActionContext<DevicesState, RootState>, deviceData: DeviceData) => {
    await request(endpoints.devices + deviceData._id, 'PATCH', deviceData);
    context.commit(types.mutations.DEVICES_SAVE_OK, deviceData);
  },
  /**
   * Add new device. It will be added with default data and will be given unique id on server.
   */
  [types.actions.DEVICES_ADD]: async (context: ActionContext<DevicesState, RootState>) => {
    const res = await request(endpoints.devices, 'POST', getNewDeviceData());
    context.commit(types.mutations.DEVICES_ADD_OK, res.data);
  },
  /**
   * Delete device by its id.
   */
  [types.actions.DEVICES_DELETE]: async (context: ActionContext<DevicesState, RootState>, id: string) => {
    const res = await request(endpoints.devices + id, 'DELETE');
    context.commit(types.mutations.DEVICES_DELETE_OK, res.data.device._id);
  },
};

const getters = {
  /**
   * Test if device is active
   */
  [types.getters.IS_DEVICE_ACTIVE]: (state: DevicesState) => (deviceId: string) => {
    return state.activeDevices.includes(deviceId);
  },
};

export default {
  state: initialState,
  mutations,
  actions,
  getters,
};
