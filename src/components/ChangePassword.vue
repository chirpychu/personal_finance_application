<template>
  <v-card width="600" class="mx-auto mt-10">
    <v-toolbar color="blue" dark>
      <v-card-title class="layout justify-center">
        <h1>Change Password</h1>
      </v-card-title>
    </v-toolbar>

    <v-card-text>
      <v-form ref="form" @submit.prevent="submitPasswordChange">
        <v-text-field
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="New Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :counter="20"
          :rules="pwdRules"
        />
        <v-text-field
          v-model="password_confirm"
          :type="showPassword2 ? 'text' : 'password'"
          label="Confirm Password"
          prepend-icon="mdi-lock"
          :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword2 = !showPassword2"
          :counter="20"
          :rules="pwdRules"
        />
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-center">
      <v-btn v-on:click="submitPasswordChange" large rounded color="info"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
//const bcrypt = require("bcrypt");
export default {
  name: "changePassword",
  data() {
    return {
      showPassword: false,
      showPassword2: false,
      password: "",
      password_confirm: "",
      errorValidation: false,
      pwdRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length <= 20) || "Password must be less than 20 characters",
        v => (v || "").indexOf(" ") < 0 || "No spaces are allowed"
      ]
    };
  },
  computed: {
    retrieveUserId() {
      return this.$store.getters["authentication/getUserId"];
    }
  },
  methods: {
    submitPasswordChange() {
      if (this.password != this.password_confirm) {
        console.log("Password keyed are different!");
        alert("Password keyed are different!");
        return (this.errorMessage =
          "Discrepancy in password. Please key in again!");
      }
      //const salt = bcrypt.genSalt(10);
      //const hashedPassword = bcrypt.hash(this.password, salt);
      this.$http
        .post("/setting/resetpassword", {
          userId: this.retrieveUserId,
          password: this.password,
          token: this.$route.params.token
        })
        .then(res => {
          console.log(res);
          this.$refs.form.reset();
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
            alert(err.response.data);
            this.errorValidation = true;
          }
        });
      (this.password = null),
        (this.password_confirm = null),
        (this.errorMessage = null);
    }
  }
};
</script>
