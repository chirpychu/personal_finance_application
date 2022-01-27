<template>
  <v-data-table
    :headers="headers"
    :items="transactions"
    sort-by="transactionAmount"
    class="elevation-1"
  >
    <template v-slot:item.TRANS_DATE="{ item }">
      <span>{{ new Date(item.TRANS_DATE).toLocaleString() }}</span>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Recent Transaction</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.TRANS_DESCRIPTION"
                      label="Purpose"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.TRANS_AMOUNT"
                      label="Transaction Amount"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.CATEGORY_ID"
                      label="Category"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.TRANS_DATE"
                      label="Date"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this transaction?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Purpose",
        align: "start",
        sortable: false,
        value: "TRANS_DESCRIPTION"
      },
      { text: "Transaction Amount", value: "TRANS_AMOUNT" },
      { text: "Category", value: "CATEGORY_ID" },
      { text: "Date", value: "TRANS_DATE" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    transactions: [],
    editedIndex: -1,
    editedItem: {
      TRANS_DESCRIPTION: "",
      TRANS_AMOUNT: 0,
      CATEGORY_ID: 0,
      TRANS_DATE: 0
    },
    defaultItem: {
      TRANS_DESCRIPTION: "",
      TRANS_AMOUNT: 0,
      CATEGORY_ID: 0,
      TRANS_DATE: 0
    },
    beforeEditedTransaction: {
      TRANS_DESCRIPTION: "",
      TRANS_AMOUNT: 0,
      CATEGORY_ID: 0,
      TRANS_DATE: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Transaction";
    },
    retrieveAccountId() {
      return this.$store.getters["authentication/getAccountId"];
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    transactions() {
      //alert("You changed a transaction!");
    }
  },

  created() {
    this.RetrieveTransactionHistory();
    this.$eventBus.$on("update-transaction-history", data => {
      console.log(data);
      this.RetrieveTransactionHistory();
    });
  },

  methods: {
    ...mapActions({
      editTransaction: "transaction/editTransaction",
      deleteTransaction: "transaction/deleteTransaction"
    }),
    RetrieveTransactionHistory() {
      this.$http
        .get("transaction/account/" + this.retrieveAccountId)
        .then(res => {
          this.transactions = res.data;
          console.log(typeof this.transactions);
          console.log(this.transactions);
        })
        .catch(err => {
          console.log(err);
        });
    },
    editUpdateTransactionHistory(val) {
      console.log(val);
      this.$store
        .dispatch("transaction/editTransaction", {
          accountId: this.retrieveAccountId,
          transactionId: this.transactions[val].TRANS_ID,
          purpose: this.transactions[val].TRANS_DESCRIPTION,
          transactionamount: this.transactions[val].TRANS_AMOUNT,
          transactiondate: this.transactions[val].TRANS_DATE,
          transactioncategory: parseInt(this.transactions[val].CATEGORY_ID),
          transactiontype: this.transactions[val].TRANS_TYPE,
          beforeEditedTransaction: this.beforeEditedItem
        })
        .then(() => {
          alert("Edit Update Transaction");
          console.log(
            `Updated for transaction ${this.transactions[val].TRANS_ID}`
          );
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
    },
    deleteTransactionHistory(val) {
      const authorizationToken = localStorage.getItem("user");
      console.log(`Deletion of transaction history record: ${val}`);
      console.log(`Authorization token: ${authorizationToken}`);
      this.$store
        .dispatch("transaction/deleteTransaction", {
          accountId: this.retrieveAccountId,
          transactionId: this.transactions[val].TRANS_ID,
          transactioncategory: parseInt(this.transactions[val].CATEGORY_ID),
          beforeEditedTransaction: this.beforeEditedItem,
          headers: {
            Authorization: authorizationToken
          }
        })
        .then(res => {
          alert("Deleted Transaction!");
          console.log(res.data);
        })
        .catch(err => {
          if (err.response) {
            console.log(err.response.data);
          }
        });
    },
    editItem(item) {
      this.editedIndex = this.transactions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.beforeEditedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.transactions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.beforeEditedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.deleteTransactionHistory(this.editedIndex);
      this.transactions.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.transactions[this.editedIndex], this.editedItem);
      } else {
        this.transactions.push(this.editedItem);
      }
      console.log(
        "Logging All Transactions for " + this.editedIndex,
        this.transactions
      );
      console.log(
        "Log edited transaction " +
          this.transactions[this.editedIndex].TRANS_DESCRIPTION
      );
      this.editUpdateTransactionHistory(this.editedIndex);
      this.close();
    }
  }
};
</script>
