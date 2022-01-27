import axios from "axios";
import jwt_decode from "jwt-decode";
export default {
  namespaced: true,
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
    getAccountId(state) {
      return jwt_decode(state.user).acctId;
    },
    getUserId(state) {
      return jwt_decode(state.user).userId;
    },
    getUserName(state) {
      return jwt_decode(state.user).userName;
    },
    getUserIsAdmin(state) {
      return jwt_decode(state.user).isAdmin;
    }
  },
  state: {
    user: null
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
    },
    LOGOUT() {
      localStorage.removeItem("user");
      location.reload();
    }
  },
  actions: {
    login({ commit }, credentials) {
      console.log(credentials);
      return axios
        .post("/auth/login", credentials)
        .then(({ data }) => {
          //alert("A");
          commit("SET_USER_DATA", data);
        })
        .catch(err => {
          throw err;
        });
    },
    // register({}, credentials) {
    //   return axios
    //     .post("/auth/register", credentials)
    //     .then(({ data }) => {
    //       alert("D");
    //       console.log("user data is", data);
    //       //commit("SET_USER_DATA", data);
    //     })
    //     .catch(err => {
    //       console.log(err.response.data);
    //       throw err;
    //     });
    // },
    logout({ commit }) {
      commit("LOGOUT");
    }
  }
};
