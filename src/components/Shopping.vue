<template>
  <v-card class="mx-auto" max-width="250" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Shopping</div>
        <input v-model="shoppingTransaction" />
        <v-list-item-subtitle>Overall Shopping Amount</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="100" color="pink"
        ><v-icon dark>mdi-shopping</v-icon></v-list-item-avatar
      >
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    shoppingValue: 0,
    categoryId: 1 //Cannot hardcode
  }),
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    ...mapState("transaction", {
      shoppingTransaction: state => state.transactions.shopping
    })
  },
  methods: {
    // RetrieveTransactionAmountByCategory() {
    //   this.$store
    //     .dispatch("accountTransaction/updateTransactionalFigures", {
    //       accountId: this.retrieveAccountId,
    //       categoryId: this.catogoryId
    //     })
    //     .then(() => {
    //       console.log(
    //         `Updated transaction amount by category ${this.catogoryId} for account ${this.retrieveAccountId}`
    //       );
    //     })
    //     .catch(err => {
    //       console.log(err.response.data);
    //       this.errorMessage = err.response.data;
    //     });
    // }
    //To be move to veux share as an action?
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
