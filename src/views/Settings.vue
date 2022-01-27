<template>
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link to="/dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/addCash">
          <v-list-item-action>
            <v-icon>mdi-cash</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Add Cash</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/settings">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
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

    <v-layout row wrap align-center justify-center>
      <ChangePassword />
      <ChangeCurrency />
    </v-layout>
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
import ChangePassword from "@/components/ChangePassword.vue";
import ChangeCurrency from "@/components/ChangeCurrency.vue";

export default {
  components: {
    ChangePassword,
    ChangeCurrency
  },
  data: () => ({
    drawer: null
  }),
  methods: {
    logout() {
      this.$store.dispatch("authentication/logout");
      // console.log("logging out!");
      // localStorage.removeItem("usertoken");
      // this.$router.push({ name: "login" });
    }
  },
  created() {
    this.$vuetify.theme.dark = false;
  }
};
</script>
