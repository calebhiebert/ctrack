import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: '',
    me: null,
    entity: null,
  },

  mutations: {
    setUser(state, user) {
      state.me = user;
    },

    setRoom(state, room) {
      state.room = room;
    },

    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
});
