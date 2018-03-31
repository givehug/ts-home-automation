import Vue from 'vue';

Vue.filter('capitalize', (value: string) => {
	return value.charAt(0).toUpperCase() + value.slice(1);
});
