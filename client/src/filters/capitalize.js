import Vue from 'vue';

Vue.filter('capitalize', value => {
	return value.charAt(0).toUpperCase() + value.slice(1);
});
