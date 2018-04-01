/**
 * Settings state has main object 'data' where all user settings are stored.
 */

import {endpoints, request} from './../../api';
import * as constants from './../constants';

const initialState = {
  data: {},
};

const mutations = {
  /**
   * Update settings state
   */
  [constants.mutations.SETTINGS_UPDATE](state, update) {
    state.data = {...state.data, ...update};
  },
};

const actions = {
  /**
   * Save settings on server
   */
  [constants.actions.SETTINGS_SAVE]: async (context, update) => {
    await request(endpoints.settings, 'PATCH', update);
    context.commit(constants.mutations.SETTINGS_UPDATE, update);
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
