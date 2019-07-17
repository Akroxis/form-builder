import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    formData: {}
  },
  mutations: {
    updateFormData(state, payload) {
      state.formData = payload;
    }
  },
  getters: {
    getActualFormData(state) {
      return state.formData;
    }
  },
  actions: {
    SET_FORMDATA({ commit }, payload) {
      commit("updateFormData", payload);
    }
  }
});
