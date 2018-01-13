import Vue from 'vue';
import Router from 'vue-router';

// components
import DashboardPage from '@/components/pages/DashboardPage.vue';
import LoginPage from '@/components/pages/LoginPage.vue';
import DevicesPage from '@/components/pages/DevicesPage.vue';
import UsersPage from '@/components/pages/UsersPage.vue';
import WelcomePage from '@/components/pages/WelcomePage.vue';
import NotFoundPage from '@/components/pages/NotFoundPage.vue';
import ProfilePage from '@/components/pages/ProfilePage.vue';
import SettingsPage from '@/components/pages/SettingsPage.vue';

// store
import store from '@/store';
import {actions} from '@/store/constants';

Vue.use(Router);

const router = new Router({
	mode: 'history',
	routes: [{
		path: '/',
		name: 'welcome',
		component: WelcomePage,
		meta: {
			onlyGuest: true,
			title: '',
		},
	}, {
		path: '/dashboard',
		name: 'dashboard',
		component: DashboardPage,
		meta: {
			onlyUser: true,
			title: 'Dashboard',
		},
	}, {
		path: '/login',
		name: 'login',
		component: LoginPage,
		meta: {
			onlyGuest: true,
			title: 'Log in',
		},
	}, {
		path: '/devices',
		name: 'device-list',
		component: DevicesPage,
		meta: {
			onlyUser: true,
			title: 'Devices',
		},
	}, {
		path: '/settings',
		name: 'settings',
		component: SettingsPage,
		meta: {
			onlyUser: true,
			title: 'Settings',
		},
	}, {
		path: '/profile',
		name: 'profile',
		component: ProfilePage,
		meta: {
			onlyUser: true,
			title: 'Profile',
		},
	}, {
		path: '/users',
		name: 'users',
		component: UsersPage,
		meta: {
			onlyUser: true,
			title: 'Users',
		},
	}, {
		path: '*',
		component: NotFoundPage,
	}],
});

// guards
router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token');

	// ONLY USER ROUTING
	if (to.matched.some(record => record.meta.onlyUser)) {
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
	} else if (to.matched.some(record => record.meta.onlyGuest)) {
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
