<template>
  <v-card class="mx-auto" max-width="250" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-100">BALANCE</div>
        <input v-model="balanceValue" />
        <v-list-item-subtitle>Overall</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="100" color="green"
        ><v-icon dark>mdi-cash</v-icon></v-list-item-avatar
      >
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "accountBalance",
  data() {
    return {
      //balanceValue: 0
    };
  },
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    ...mapState("transaction", {
      balanceValue: state => state.accountbalance
    })
  },
  methods: {
    RetrieveAccountBalance() {
      this.$store
        .dispatch("transaction/retrieveAccountBalance", this.retrieveAccountId)
        .then(() => {
          console.log("Account Balance Retrieved!");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    console.log(
      `Retrieving Account Balance for Account: ${this.retrieveAccountId}`
    );
    this.RetrieveAccountBalance();
  }
};
</script>

<style></style>
