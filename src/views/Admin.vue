<template>
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app clipped>
      <v-layout column align-center>
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img src="/img1.png" alt="" />
          </v-avatar>
          <h2 class="white--text mt-1 text-center">{{ retrieveUserName }}</h2>
        </v-flex>
        <v-flex class="mt-4 mb-4"> </v-flex>
      </v-layout>
      <v-list dense>
        <v-list-item link to="/admin">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>User Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Personal Financial Application</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-on:click="logout" color="blue">Logout</v-btn>
    </v-app-bar>
    <v-container class="bv-example-row">
      <v-row>
        <Admin />
      </v-row>
    </v-container>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="shrink">
          <v-tooltip right></v-tooltip>
        </v-col>
      </v-row>
    </v-container>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} TIC2601 - Group 18</span>
    </v-footer>
  </v-app>
</template>

<script>
import Admin from "../components/Admin";
export default {
  components: {
    Admin
  },
  data() {
    return {
      drawer: null
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("authentication/logout");
    }
  },
  computed: {
    // retrieveAccountId() {
    //   return this.$store.getters["authentication/getAccountId"];
    // },
    retrieveUserName() {
      return this.$store.getters["authentication/getUserName"];
    }
  }
};
</script>

<style></style>
