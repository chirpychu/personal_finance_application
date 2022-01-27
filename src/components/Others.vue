<template>
  <v-card class="mx-auto" max-width="250" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Others</div>
        <input v-model="othersTransaction" />
        <v-list-item-subtitle>Overall others Amount</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="100" color="black"
        ><v-icon dark>mdi-leaf</v-icon></v-list-item-avatar
      >
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    othersValue: "0",
    categoryId: 4 // Should not be hardcoded
  }),
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    ...mapState("transaction", {
      othersTransaction: state => state.transactions.others
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
