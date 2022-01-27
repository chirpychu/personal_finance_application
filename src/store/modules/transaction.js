import axios from "axios";

export default {
  namespaced: true,
  state: {
    transactions: {
      shopping: 0,
      billUtilities: 0,
      foodDrinks: 0,
      others: 0
    },
    accountbalance: 0,
    accountcurrencysettings: null
  },
  mutations: {
    SET_TRANSACTIONAL_DATA(state, transactionalData) {
      // alert(
      //   `mutation transactionalData category ${transactionalData.categoryId}`
      // );
      // alert(
      //   `mutation transactionalData sum ${transactionalData.transactionSum}`
      // );
      if (transactionalData.categoryId === 1) {
        console.log("mutation 1");
        //alert("mutation1");
        state.transactions.shopping = transactionalData.transactionSum;
      }
      if (transactionalData.categoryId === 2) {
        console.log("mutation 2");
        //alert("mutation2");
        state.transactions.foodDrinks = transactionalData.transactionSum;
      }
      if (transactionalData.categoryId === 3) {
        console.log("mutation 3");
        //alert("mutation3");
        state.transactions.billUtilities = transactionalData.transactionSum;
      }
      if (transactionalData.categoryId === 4) {
        console.log("mutation 4");
        //alert("mutation4");
        state.transactions.others = transactionalData.transactionSum;
      }
      //alert(`mutation out`);
    },
    SET_ACCOUNTBALANCE_DATA(state, accountBalanceData) {
      state.accountbalance = accountBalanceData;
    },
    SET_ACCOUNTCURRENCY_SETTINGS(state, accountCurrencySetting) {
      state.accountcurrencysettings = accountCurrencySetting;
    }
  },
  actions: {
    submittingCash({ dispatch }, cashPayload) {
      axios.post("/transaction-revenue", cashPayload).then(response => {
        console.log(`Submitted Cash of : ${response.data.TRANS_AMOUNT}`);
        const accountId = response.data.ACC_ID;
        console.log(
          `Dispatch retrieval of account balance after adding cash for account ${accountId}`
        );
        dispatch("retrieveAccountBalance", accountId);
      });
    },
    editTransaction({ dispatch }, editTransactionPayload) {
      const resetTransactionCategoryStates = {
        categoryId: parseInt(
          editTransactionPayload.beforeEditedTransaction.CATEGORY_ID
        ),
        transactionSum: 0
      };
      console.log(
        `Before clicked on edit transaction's category ${resetTransactionCategoryStates.categoryId}`
      );
      axios
        .put(
          `/transaction/account/${editTransactionPayload.accountId}`,
          editTransactionPayload
        )
        .then(response => {
          console.log("EditTransaction", response);
          dispatch("retrieveAccountBalance", editTransactionPayload.accountId);
          dispatch("resetTransactionalStates", resetTransactionCategoryStates);
          dispatch("updateTransactionalFigures", editTransactionPayload);
        })
        .catch(err => {
          alert(err.response.data);
          console.log(err.response.data);
        });
    },
    deleteTransaction({ dispatch }, deletionPayload) {
      const resetTransactionCategoryStates = {
        categoryId: parseInt(
          deletionPayload.beforeEditedTransaction.CATEGORY_ID
        ),
        transactionSum: 0
      };
      console.log(
        `Click on transaction to be deleted ${resetTransactionCategoryStates.categoryId}`
      );
      console.log(
        `Account Id from deletion payload is ${deletionPayload.accountId}`
      );
      console.log(
        `Transaction Id from deletion payload is ${deletionPayload.transactionId}`
      );
      axios
        .delete(
          `/transaction/deletion/account/${deletionPayload.accountId}/${deletionPayload.transactionId}`,
          {
            headers: {
              Authorization: deletionPayload.Authorization
            }
          }
        )
        .then(response => {
          console.log("DeletionTransaction", response);
          dispatch("retrieveAccountBalance", deletionPayload.accountId);
          dispatch("resetTransactionalStates", resetTransactionCategoryStates);
          dispatch("updateTransactionalFigures", deletionPayload);
        })
        .catch(err => {
          alert(err.response.data);
          console.log(err.response.data);
        });
    },
    resetTransactionalStates({ commit }, resetTransactionPayload) {
      commit("SET_TRANSACTIONAL_DATA", resetTransactionPayload);
    },
    submittingExpense({ dispatch }, expensePayload) {
      axios
        .post("/transaction-expense", expensePayload)
        .then(response => {
          console.log("Here", response);
          const accountCategory = {
            accountId: response.data.ACC_ID,
            transactioncategory: response.data.CATEGORY_ID
          };
          console.log(accountCategory);
          dispatch("updateTransactionalFigures", accountCategory);
          dispatch("retrieveAccountBalance", accountCategory.accountId);
        })
        .catch(err => {
          alert(err.response.data);
          console.log(err.response.data);
        });
    },
    updateTransactionalFigures({ commit }, accountCategoryPayload) {
      console.log(
        `AccountID passed in updateTransactionFigure action ${accountCategoryPayload.accountId}`
      );
      console.log(
        `CategoryId passed updateTransactionFigure action ${accountCategoryPayload.transactioncategory}`
      );
      return axios
        .get(
          `/transaction/account/${accountCategoryPayload.accountId}/category/${accountCategoryPayload.transactioncategory}`
        )
        .then(({ data }) => {
          console.log("Transactional data is", data.transactionSum);
          const collatedTransactionByCategory = {
            transactionSum: data.transactionSum,
            categoryId: accountCategoryPayload.transactioncategory
          };
          console.log(
            `collatedTransaction is ${collatedTransactionByCategory}`
          );
          console.log(
            `collatedTransaction for account is ${collatedTransactionByCategory.transactionSum}`
          );
          console.log(
            `collatedTransaction for category is ${collatedTransactionByCategory.categoryId}`
          );
          //alert("commiting for transaction");
          commit("SET_TRANSACTIONAL_DATA", collatedTransactionByCategory);
        });
    },
    retrieveAccountBalance({ commit }, accountIdPayload) {
      console.log(`Account Id Payload passed down: ${accountIdPayload}`);
      return axios.get("/accountDetails/" + accountIdPayload).then(response => {
        console.log("Account Balance is", response.data.ACC_BALANCE);
        //alert("commiting for account balance");
        commit("SET_ACCOUNTBALANCE_DATA", response.data.ACC_BALANCE);
      });
    },
    retrieveTransactionByCategory({ commit }, accountIdCategoryIdPayload) {
      console.log(
        `In retrieveTransactionByCategory ${accountIdCategoryIdPayload}`
      );
      console.log(
        `In retrieveTransactionByCategory - Account${accountIdCategoryIdPayload.accountId}`
      );
      console.log(
        `In retrieveTransactionByCategory - Category${accountIdCategoryIdPayload.categoryId}`
      );
      return axios
        .get(
          "/transaction/account/" +
            accountIdCategoryIdPayload.accountId +
            "/category/" +
            accountIdCategoryIdPayload.categoryId
        )
        .then(res => {
          console.log(`Response from server ${res.data}`);
          console.log(
            `Response from server - Account ${res.data.transactionSum}`
          );
          const collatedTransactionByCategory = {
            transactionSum: res.data.transactionSum,
            categoryId: accountIdCategoryIdPayload.categoryId
          };
          console.log(
            `Collated - transaction is ${collatedTransactionByCategory.transactionSum}`
          );
          console.log(
            `Collated - transaction is ${collatedTransactionByCategory.categoryId}`
          );
          commit("SET_TRANSACTIONAL_DATA", collatedTransactionByCategory);
        });
    },
    retrieveAccountCurrency({ commit }, accountIdPayload) {
      console.log(
        `[Retrieval of currency settings] Account Id Payload passed down: ${accountIdPayload}`
      );
      return axios.get("/accountDetails/" + accountIdPayload).then(response => {
        console.log("Account Balance is", response.data.CURRENCY_ID);
        commit("SET_ACCOUNTCURRENCY_SETTINGS", response.data.CURRENCY_ID);
      });
    }
  }
};
