/**
 * Common home settings
 */

import {endpoints, request} from '../../api';
import * as types from '@/store/types';
import {HomeSettings, RootState} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';

const initialState: HomeSettings = {
    networkCustomNames: {},
};

const mutations = {
  [types.mutations.HOME_SETTINGS_UPDATE](state: HomeSettings, update: object) {
    Object.keys(update).forEach((key) => {
      state[key] = update[key];
    });
  },
};

const actions = {
  /**
   * Save home settings on server
   */
  [types.actions.HOME_SETTINGS_SAVE]: async (context: ActionContext<HomeSettings, RootState>, update: object) => {
    await request(endpoints.homeSettings, 'PATCH', update);
    context.commit(types.mutations.HOME_SETTINGS_UPDATE, update);
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
