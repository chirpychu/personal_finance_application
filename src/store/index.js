import Vue from "vue";
import Vuex from "vuex";
import authentication from "./modules/auth";
import transaction from "./modules/transaction";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { authentication, transaction }
});
