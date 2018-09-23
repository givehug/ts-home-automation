// Import modules
import Vue from 'vue';
import {endpoints, request} from '../../api';
import * as types from '../types';

// Import interfaces
import {UsersState, RootState, UsersMap} from '@/../../common/@types/store';
import {ActionContext} from 'vuex';


const initialState: UsersState = {map: {}};

const mutations = {
  [types.mutations.USERS_MAP_UPDATE](state: UsersState, map: UsersMap) {
    state.map = map;
  },
  [types.mutations.USERS_MAP_ADD](state: UsersState, {userId, userData}: {userId: string, userData: string}) {
    Vue.set(state.map, userId, userData);
  },
  [types.mutations.USERS_MAP_REMOVE](state: UsersState, userId: string) {
    Vue.delete(state.map, userId);
  },
};

const actions = {
  [types.actions.USERS_INVITE]: async (
    context: ActionContext<UsersState, RootState>,
    {email, name}: {email: string, name: string}
  ) => {
    try {
      const res = await request(endpoints.users, 'POST', {
        email,
        name,
      });

      context.commit(types.mutations.USERS_MAP_ADD, {
        userId: res.data,
        userData: {
          email,
          name,
          _id: res.data,
          deviceIdentifiers: [],
          networkCustomNames: {},
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  },
  [types.actions.USERS_DELETE]: async (context: ActionContext<UsersState, RootState>, userId: string) => {
    try {
      await request(endpoints.users + userId, 'DELETE');
      context.commit(types.mutations.USERS_MAP_REMOVE, userId);

      return true;
    } catch (error) {
      return false;
    }
  },
};

export default {
  state: initialState,
  mutations,
  actions,
};
