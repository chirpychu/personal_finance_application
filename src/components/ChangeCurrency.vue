<template>
  <v-card width="600" class="mx-auto mt-10">
    <v-toolbar color="orange" dark>
      <v-card-title class="layout justify-center">
        <h1>Change Currency</h1>
      </v-card-title>
    </v-toolbar>

    <v-card-text>
      <v-form>
        <v-select
          v-model="select"
          prepend-icon="mdi-currency-usd"
          :items="currencies"
          label="currency"
          required
        ></v-select>
      </v-form>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn v-on:click="ChangeCurrency" large color="orange">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "changeCurrency",
  data() {
    return {
      select: null,
      currencies: []
    };
  },
  computed: {
    ...mapState("transaction", {
      getAccountCurrencySetting: state => state.accountcurrencysettings
    }),
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    convertCurrencyIndex() {
      const currencyMatch = element => element === this.select;
      return this.currencies.findIndex(currencyMatch);
    }
  },
  methods: {
    RetrieveAllCurrencies() {
      return this.$http
        .get("/setting/currency")
        .then(res => {
          var result = res.data;
          console.log("Printing available currencies", result);
          this.currencies = result.map(obj => {
            return obj.NAME;
          });
        })
        .catch(err => console.log(err));
    },
    ChangeCurrency() {
      console.log(this.convertCurrencyIndex);
      console.log(this.retrieveAccountId);
      this.$http
        .put(
          `/setting/currency/account/${this.retrieveAccountId}/currency/${this
            .convertCurrencyIndex + 1}`
        )
        .then(res => {
          alert("Changing Currency!");
          console.log(res.data);
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
      this.select = null;
    }
  },
  mounted() {
    this.RetrieveAllCurrencies();
  }
};
</script>
