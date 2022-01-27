<template>
  <v-app>
    <v-navigation-drawer dark v-model="drawer" app clipped>
      <v-layout column align-center center>
        <v-flex class="mt-5">
          <v-avatar size="100">
            <img src="/img1.png" alt="" />
          </v-avatar>
          <h4 class="white--text mt-1 text-center">{{ retrieveUserName }}</h4>
        </v-flex>
        <v-flex class="mt-4 mb-4"> </v-flex>
      </v-layout>
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
    <v-container class="bv-example-row">
      <v-row>
        <v-flex sm3 xs3 md1.5 lg3>
          <AccountBalance />
        </v-flex>
        <v-flex sm3 xs3 md1.5 lg3>
          <Shopping />
        </v-flex>
        <v-flex sm3 xs3 md1.5 lg3>
          <FoodDrink />
        </v-flex>
        <v-flex sm3 xs3 md1.5 lg3>
          <BillsUtility />
        </v-flex>
        <v-flex sm3 xs3 md1.5 lg3>
          <Others />
        </v-flex>
      </v-row>
    </v-container>
    <v-container class="bv-example-col">
      <v-row>
        <v-col sm="6">
          <TransactionHistory />
        </v-col>
        <v-col sm="6">
          <AddExpenditure />
        </v-col>
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
// @ is an alias to /src
import AccountBalance from "../components/AccountBalance";
import BillsUtility from "../components/BillsUtility.vue";
import FoodDrink from "../components/FoodDrink.vue";
import Others from "../components/Others.vue";
import Shopping from "../components/Shopping.vue";
import TransactionHistory from "../components/TransactionHistory.vue";
import AddExpenditure from "../components/AddExpenditure";
//import jwtDecode from "jwt-decode";

export default {
  components: {
    AccountBalance,
    BillsUtility,
    FoodDrink,
    Others,
    Shopping,
    TransactionHistory,
    AddExpenditure
  },
  data() {
    const token = localStorage.usertoken;
    return {
      token: token,
      drawer: null
    };
  },
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    retrieveUserName() {
      return this.$store.getters["authentication/getUserName"];
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("authentication/logout");
    }
  },
  created() {
    this.$vuetify.theme.dark = false;
  },
  mounted() {
    this.$store
      .dispatch("transaction/retrieveAccountCurrency", this.retrieveAccountId)
      .then(() => {
        console.log(
          `Retrieving Currency Settings for Account ${this.retrieveAccountId}`
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
