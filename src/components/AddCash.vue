<template>
  <v-card width="600" class="mx-auto mt-5">
    <v-card-title class="pb-0, green">
      <h1 class="white--text">Add Cash</h1>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-text-field
          v-model="source"
          label="Source"
          prepend-icon="mdi-file-document-edit-outline"
          :rules="sourceRules"
          required
        />
        <v-text-field
          v-model="sum"
          label="Sum"
          prepend-icon="mdi-alpha-s-circle-outline"
        />
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
      <v-btn v-on:click="submitCash" color="success">Submit</v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "add-cash",
  data() {
    return {
      source: "",
      sum: "",
      date: new Date().toISOString().substr(0, 10),
      transactionCategory: 5,
      transactionType: "Credit",
      dateFormatted: null,
      dateMenu: false,
      minDate: "1900-07-04",
      maxDate: "2090-08-30",
      sourceRules: [
        v => !!v || "Source is required",
        v => (v && v.length <= 50) || "Source must be less than 50 characters"
      ]
    };
  },
  computed: {
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    }
  },
  methods: {
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
    submitCash() {
      this.$store
        .dispatch("transaction/submittingCash", {
          acctid: this.retrieveAccountId,
          source: this.source,
          sum: this.sum,
          transactiondate: this.date,
          transactioncategory: this.transactionCategory,
          transactiontype: this.transactionType
        })
        .then(() => {
          console.log(`Adding cash of ${this.sum}`);
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
      this.$refs.form.reset();
      // this.source = "";
      // this.sum = "";
      // this.date = null;
    }
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  }
};
</script>

<style></style>
