<template>
  <v-card class="mx-auto" max-width="300" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Food & Drinks</div>
        <input v-model="foodDrinkTransaction" />
        <v-list-item-subtitle
          >Overall Food & Drinks Amount</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-avatar tile size="100" color="brown"
        ><v-icon dark>mdi-food</v-icon></v-list-item-avatar
      >
    </v-list-item>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  data: () => ({
    eatingValue: "0",
    categoryId: 2 //Should not be hardcoded
  }),
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    ...mapState("transaction", {
      foodDrinkTransaction: state => state.transactions.foodDrinks
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
