<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-toolbar-title>Personal Finance App Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form v-on:submit.prevent="submitLogin">
          <v-text-field
            v-model="email"
            label="Email"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :counter="50"
            :rules="pwdRules"
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn to="/register" color="success">Register</v-btn>
        <v-btn :disabled="!valid" v-on:click="submitLogin" color="info"
          >Login</v-btn
        >
      </v-card-actions>
      <p v-if="errorMessage != null">
        <b class="red--text">{{ errorMessage }}</b>
      </p>
    </v-card>
  </v-app>
</template>

<script>
// @ is an alias to /src
//import { ValidationProvider } from "vee-validate";
//import { mapActions } from "vuex";
export default {
  // components: {
  //   ValidationProvider
  // },
  data() {
    return {
      showPassword: false,
      valid: true,
      email: "",
      password: "",
      //errorValidation: false,
      errorMessage: null,
      pwdRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length <= 50) || "Password must be less than 50 characters",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ]
    };
  },
  methods: {
    submitLogin() {
      this.$store
        .dispatch("authentication/login", {
          user_email: this.email,
          password: this.password
        })
        .then(() => {
          //alert("B");
          if (this.retrieveUserIsAdmin) {
            this.$router.push({ name: "admin" });
          } else {
            this.$router.push({ name: "dashboard" });
          }
        })
        .catch(err => {
          console.log(err.response.data);
          this.errorMessage = err.response.data;
        });
    }
  },
  computed: {
    retrieveUserName() {
      return this.$store.getters["authentication/getUserName"];
    },
    retrieveUserIsAdmin() {
      return this.$store.getters["authentication/getUserIsAdmin"];
    }
  }
};
</script>
