import '../../config/config';

import Vue from 'vue';

// external modules
import Buefy from 'buefy';

Vue.use(Buefy);

// filters
import './filters';

// app modules
import App from './components/App.vue';
import router from './router';
import store from './store';

// pwa
import './registerServiceWorker';

// styles
import './assets/styles/main.scss';

// config
Vue.config.productionTip = false;

// create app
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
