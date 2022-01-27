<template>
  <v-app>
    <v-card width="600" class="mx-auto mt-5">
      <v-card-title class="pb-0, yellow">
        <h1>Add Expenditure</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="purpose"
            label="Purpose"
            prepend-icon="mdi-file-document-edit-outline"
            required
          />
          <v-text-field
            v-model="transaction_amount"
            label="Transaction amount"
            prefix="$"
            prepend-icon="mdi-alpha-s-circle-outline"
            :rules="amountRules"
            required
          />
          <v-select
            v-model="selected_category"
            :items="category"
            :rules="[v => !!v || 'Item is required']"
            label="Category"
            required
          ></v-select>
          <v-menu
            ref="dateMenu"
            v-model="dateMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Date"
                prepend-icon="mdi-calendar-today"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              :min="minDate"
              :max="maxDate"
              no-title
              @input="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="submitExpense" color="success">Submit</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "addExpenditure",
  data() {
    return {
      purpose: "",
      transaction_amount: "",
      selected_category: null,
      category: [],
      transactionType: "Debit",
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: null,
      dateMenu: false,
      minDate: "1900-07-04",
      maxDate: "2090-08-30",
      amountRules: [v => !!v || "Amount is required"]
    };
  },
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    },
    //Array index starts from 1
    retrieveSelectedCategory() {
      return this.category.indexOf(this.selected_category) + 1;
    }
  },
  methods: {
    ...mapActions({
      expenseSubmission: "transaction/submittingExpense"
    }),
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    submitExpense() {
      this.$store
        .dispatch("transaction/submittingExpense", {
          acctid: this.retrieveAccountId,
          purpose: this.purpose,
          transactionamount: this.transaction_amount,
          transactiondate: this.date,
          transactioncategory: parseInt(this.retrieveSelectedCategory),
          transactiontype: this.transactionType
        })
        .then(() => {
          alert("Submitting Expense");
          console.log(
            `Adding expense for category ${this.retrieveSelectedCategory}`
          );
          this.$eventBus.$emit(
            "update-transaction-history",
            "Transaction Added. Performing update refresh on transaction history table"
          );
        })
        .catch(err => {
          alert("Error occur upon submitting expense");
          console.log(err);
        });
      this.$refs.form.reset();
      // this.purpose = "";
      // this.transaction_amount = 0;
      // this.date = null;
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
      console.log(this.purpose);
      console.log(this.transaction_amount);
      console.log(this.category);
      console.log(this.selected_category);
      console.log(this.category.indexOf(this.selected_category));
      console.log(this.category.indexOf(this.selected_category) + 1);
      console.log(this.date);
    }
  },
  mounted() {
    this.$http
      .get("/retrieve-category")
      .then(res => {
        var result = res.data;
        result.splice(-1, 1); //Remove Revenue last element in array
        console.log(result);
        this.category = result.map(obj => {
          return obj.NAME;
        });
      })
      .catch(err => console.log(err));
  }
};
</script>
