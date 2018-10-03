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

const apolloProvider = createProvider();

export const apolloClient = apolloProvider.clients.defaultClient;

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app');
