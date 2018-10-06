/**
 * App state only stores some application meta data.
 * Single action is used to initialize application,
 * it fetches all necessary data and initializes other components.
 */

// Import modules
import {endpoints, request} from '../../api';
import {USER_SESSION_TOKEN} from '../../data/constants';
import * as types from '../types';

// Import interfaces
import {RootState, AppState} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';


const initialState: AppState = {
  dataLoaded: false,
};

const mutations = {
  /**
   * Set app.dataLoaded to true
   */
  [types.mutations.APP_DATA_LOADED](state: AppState) {
    state.dataLoaded = true;
  },
};

const actions = {
  /**
   * If user auth token is in local storage, get user data by it,
   * fetch all other necessary data and init components available for signe in user.
   */
  [types.actions.APP_INIT]: async (context: ActionContext<AppState, RootState>) => {
    const token = localStorage.getItem(USER_SESSION_TOKEN);

    if (!token) { return; }

    context.commit(types.mutations.USER_TOKEN_SET, token);

    try {
      // try fetching user data with token from localStorage
      const {data} = await request(endpoints.app, 'GET');

      context.commit(types.mutations.USER_DATA_SET, data.user);
      context.commit(types.mutations.USERS_MAP_UPDATE, data.users);
      context.commit(types.mutations.DEVICES_MAP_UPDATE, data.devices);
      context.commit(types.mutations.SETTINGS_UPDATE, data.settings);
      context.commit(types.mutations.HOME_SETTINGS_UPDATE, data.homeSettings);
      context.commit(types.mutations.APP_DATA_LOADED);
      context.commit(types.mutations.ROBO_INIT);
      context.commit(types.mutations.WS_CONNECT);
    } catch (error) {
      // token might be expired
      context.dispatch(types.actions.USER_LOGOUT);
    }
  },
};

export default {
  state: initialState,
  actions,
  mutations,
};
