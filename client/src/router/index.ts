import Vue from 'vue';
import Router from 'vue-router';

import {USER_SESSION_TOKEN} from '@/data/constants';

// components
import DashboardView from '@/components/views/DashboardView.vue';
import DevicesView from '@/components/views/DevicesView.vue';
import LoginView from '@/components/views/LoginView.vue';
import NotFoundView from '@/components/views/NotFoundView.vue';
import ProfileView from '@/components/views/ProfileView.vue';
import SettingsView from '@/components/views/SettingsView.vue';
import UsersView from '@/components/views/UsersView.vue';
import WelcomeView from '@/components/views/WelcomeView.vue';

// store
import store from '@/store';
import {actions} from '@/store/constants';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'welcome',
    component: WelcomeView,
    meta: {
      onlyGuest: true,
      title: '',
    },
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      onlyUser: true,
      title: 'Dashboard',
    },
  }, {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      onlyGuest: true,
      title: 'Log in',
    },
  }, {
    path: '/devices',
    name: 'device-list',
    component: DevicesView,
    meta: {
      onlyUser: true,
      title: 'Devices',
    },
  }, {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      onlyUser: true,
      title: 'Settings',
    },
  }, {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      onlyUser: true,
      title: 'Profile',
    },
  }, {
    path: '/users',
    name: 'users',
    component: UsersView,
    meta: {
      onlyUser: true,
      title: 'Users',
    },
  }, {
    path: '*',
    component: NotFoundView,
  }],
});

// guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(USER_SESSION_TOKEN);

  // ONLY USER ROUTING
  if (to.matched.some((record) => record.meta.onlyUser)) {
    // if no token for soem reason, logout
    if (!token) {
      store.dispatch(actions.USER_LOGOUT);
      next();
    }
    // wait for user.data to be loaded before entering any route
    if (!store.state.user.data) {
      const storeUnsubscirbe = store.subscribe((mutation, state) => {
        if (state.user.data) {
          storeUnsubscirbe();
          next();
        }
      });
    } else {
      next();
    }
  // ONLY GUEST ROUTIG
  } else if (to.matched.some((record) => record.meta.onlyGuest)) {
    if (token) {
      next({path: '/dashboard'});
    } else {
      next();
    }
  // ANY ROUTIG
  } else {
    next();
  }
});

export default router;
