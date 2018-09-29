import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    me: null
  },
  mutations: {
    setUser(state, user) {
      state.me = user;
    },
    setToken(state, token) {
      state.token = token;
    }
  },
  actions: {}
});
