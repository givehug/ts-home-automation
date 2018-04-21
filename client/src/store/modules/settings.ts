/**
 * Settings state has main object 'data' where all user settings are stored.
 */

//  Import modules
import {endpoints, request} from '../../api';
import * as types from '../types';

// Import interfaces
import {RootState, SettingsState} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';

const initialState: SettingsState = {
  data: {},
};

const mutations = {
  /**
   * Update settings state
   */
  [types.mutations.SETTINGS_UPDATE](state: SettingsState, update: object) {
    state.data = {...state.data, ...update};
  },
};

const actions = {
  /**
   * Save settings on server
   */
  [types.actions.SETTINGS_SAVE]: async (context: ActionContext<SettingsState, RootState>, update: object) => {
    await request(endpoints.settings, 'PATCH', update);
    context.commit(types.mutations.SETTINGS_UPDATE, update);
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
