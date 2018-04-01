// Import modules
import {USER_SESSION_TOKEN} from '../../data/constants';
import {endpoints, request} from '../../api';
import router from '../../router';
import * as types from '../types';

// Import interfaces
import {RootState, UserState, UserData} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';


const initialState: UserState = {
  token: null,
  data: null,
};

const mutations = {
  /**
   * Save user token to localStorage.
   */
  [types.mutations.USER_TOKEN_SET](state: UserState, token: string) {
    state.token = token;
    localStorage.setItem(USER_SESSION_TOKEN, token);
  },
  /**
   * Remove user token from localStorage.
   */
  [types.mutations.USER_TOKEN_CLEAR](state: UserState) {
    state.token = null;
    localStorage.removeItem(USER_SESSION_TOKEN);
  },
  /**
   * Clear user data.
   */
  [types.mutations.USER_DATA_CLEAR](state: UserState) {
    state.data = null;
  },
  /**
   * Update user data.
   */
  [types.mutations.USER_DATA_UPDATE](state: UserState, data: any) {
    state.data = {...state.data, ...data};
  },
  /**
   * Initially set user data.
   */
  [types.mutations.USER_DATA_SET](state: UserState, data: UserData) {
    state.data = data;
  },
};

const actions = {
  /**
   * Patch user data on server.
   */
  [types.actions.USER_DATA_PATCH]: async (
    context: ActionContext<UserState, RootState>,
    update: any,
  ) => {
    if (!update) {
      return;
    }

    try {
      await request(endpoints.userMe, 'PATCH', {update});
      context.commit(types.mutations.USER_DATA_UPDATE, update);

      return true;
    } catch (error) {
      return false;
    }
  },
  /**
   * Add (invite) new user.
   */
  [types.actions.USER_ADD]: async (context: ActionContext<UserState, RootState>, form: any) => {
    try {
      const res = await request(endpoints.users, 'POST', form);

      context.commit(types.mutations.USER_TOKEN_SET, res.headers['x-auth']);
      context.dispatch(types.actions.APP_INIT);

      return true;
    } catch (error) {
      return error.response.data;
    }
  },
  /**
   * Log in.
   */
  [types.actions.USER_LOGIN]: async (
    context: ActionContext<UserState, RootState>,
    {email, password}: {email: string, password: string},
  ) => {
    try {
      const res = await request(endpoints.userLogin, 'POST', {email, password});

      context.commit(types.mutations.USER_TOKEN_SET, res.headers['x-auth']);
      context.dispatch(types.actions.APP_INIT);

      return true;
    } catch (error) {
      // do nothing
    }
  },
  /**
   * Log out.
   */
  [types.actions.USER_LOGOUT]: async (context: ActionContext<UserState, RootState>) => {
    try {
      await request(endpoints.userLogout, 'DELETE');
    } catch (error) {
      // do nothing
    }
    context.commit(types.mutations.ROBO_STOP);
    context.commit(types.mutations.WS_DISCONNECT);
    context.commit(types.mutations.USER_TOKEN_CLEAR);
    context.commit(types.mutations.USER_DATA_CLEAR);
    router.push('/');
  },
};

const getters = {
  /**
   * Check if current user is authorized.
   */
  [types.getters.IS_AUTHED]: (state: UserState) => !!state.token,
  /**
   * Check if current user is admin.
   */
  [types.getters.IS_ADMIN]: (state: UserState) => !!(state.data && state.data.admin),
};

export default {
  state: initialState,
  mutations,
  actions,
  getters,
};
