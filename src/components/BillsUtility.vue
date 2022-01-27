<template>
  <v-card class="mx-auto" max-width="250" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-1">Bills & Utilities</div>
        <input v-model="billsUtilitiesTransaction" />
        <v-list-item-subtitle
          >Overall Bills & Utilities Amount</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-avatar tile size="100" color="yellow"
        ><v-icon dark>mdi-home</v-icon></v-list-item-avatar
      >
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    BillsUtilitiesValue: "0",
    categoryId: 3 // Should not be hardcoded
  }),
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    ...mapState("transaction", {
      billsUtilitiesTransaction: state => state.transactions.billUtilities
    })
  },
  methods: {
    RetrieveTransactionAmountByCategory() {
      this.$store
        .dispatch("transaction/retrieveTransactionByCategory", {
          accountId: this.retrieveAccountId,
          categoryId: this.categoryId
        })
        .then(() => {
          console.log(
            `Updated transaction state for category: ${this.categoryId}`
          );
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    this.RetrieveTransactionAmountByCategory();
  }
};
</script>
