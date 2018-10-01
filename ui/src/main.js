import Vue from 'vue';
import App from './App.vue';
import VeeValidate from 'vee-validate';
import VueSweetalert from 'vue-sweetalert2';
import router from './router';
import store from './store';
import './registerServiceWorker';
import { createProvider } from './vue-apollo';

import './styles.scss';

Vue.use(VeeValidate);
Vue.use(VueSweetalert);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount('#app');
