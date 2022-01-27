import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import moment from "moment";

Vue.prototype.moment = moment;

Vue.config.productionTip = false;

Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios.create({
      baseURL: "http://localhost:8081/api/",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
  }
});

axios.defaults.baseURL = "http://localhost:8081/api/";

Vue.prototype.$eventBus = new Vue();

const token = localStorage.getItem("user");
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

new Vue({
  router,
  store,
  vuetify,
  created() {
    const userString = localStorage.getItem("user"); // grab user data from local storage
    if (userString) {
      // check to see if there is indeed a user
      const userData = JSON.parse(userString); // parse user data into JSON
      this.$store.commit("authentication/SET_USER_DATA", userData); // restore user data with Vuex
    }
    axios.interceptors.response.use(
      response => response, // simply return the response
      error => {
        if (error.response.status === 401) {
          // if we catch a 401 error
          this.$store.dispatch("authentication/logout"); // force a log out
        }
        return Promise.reject(error); // reject the Promise, with the error as the reason
      }
    );
  },
  render: h => h(App)
}).$mount("#app");
