import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: '',
  },
  getters: {
    name(state) {
      if (state.name === null || state.name === '') {
        state.name = sessionStorage.getItem('name');
      }
      return state.name;
    },
  },
  mutations: {
    setName: (state, val) => {
      sessionStorage.setItem('name', val);
      state.name = val;
    },
  },
  actions: {},
});
