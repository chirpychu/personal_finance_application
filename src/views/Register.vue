<template>
  <v-app>
    <v-app-bar app color="black" dark>
      <v-toolbar-title>Personal Finance App Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>Register</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="username"
            :counter="20"
            :rules="usernameRules"
            prepend-icon="mdi-account"
            label="Username"
            required
          />

          <v-text-field
            v-model="firstname"
            prepend-icon="mdi-account-plus"
            label="First Name"
            :rules="firstnameRules"
            required
          />

          <v-text-field
            v-model="lastname"
            prepend-icon="mdi-account-plus"
            label="Last Name"
            :rules="lastnameRules"
            required
          />

          <v-text-field
            v-model="emailaddress"
            prepend-icon="mdi-email"
            label="Email Address"
            :rules="emailRules"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Set New Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :counter="50"
            :rules="pwdRules"
            required
          />
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn to="/" color="red">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          :disabled="!valid"
          class="mr-4"
          v-on:click="submitRegister"
          >Register</v-btn
        >
      </v-card-actions>
      <p v-if="errorMessage != null">
        <b class="red--text">{{ errorMessage }}</b>
      </p>
    </v-card>
  </v-app>
</template>

<script>
//import { mapActions } from "vuex";

export default {
  //name: "Login",
  data() {
    return {
      showPassword: false,
      valid: true,
      username: "",
      usernameRules: [
        v => !!v || "UserName is required",
        v => (v && v.length <= 20) || "UserName must be less than 20 characters"
      ],
      firstname: "",
      firstnameRules: [
        v => !!v || "First Name is required",
        v =>
          (v && v.length <= 100) ||
          "First Name must be less than 100 characters"
      ],
      lastname: "",
      lastnameRules: [
        v => !!v || "Last Name is required",
        v =>
          (v && v.length <= 100) || "Last Name must be less than 100 characters"
      ],
      emailaddress: "",
      emailRules: [
        v => !!v || "Email Address is required",
        v => /.+@.+\..+/.test(v) || "Email Address must be valid",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ],
      password: "",
      pwdRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length <= 50) || "Password must be less than 50 characters",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ],
      errorMessage: null
    };
  },
  methods: {
    submitRegister() {
      this.$http
        .post("/auth/register", {
          user_name: this.username,
          first_name: this.firstname,
          last_name: this.lastname,
          user_email: this.emailaddress,
          password: this.password
        })
        .then(response => {
          alert("C");
          console.log(`User Registered successfully`, response);
          console.log(`User Registered of User Email: ${this.emailaddress}`);
          this.$router.push({ name: "login" });
        })
        .catch(err => {
          console.log(err.response.data);
          this.errorMessage = err.response.data;
        });
    }
  }
};
</script>
