//Implementation of transaction routes
const model = require("../models/index.js");
const Transaction = model.TRANSACTION;
const Account = model.ACCOUNTS;
const User = model.USERS;

/* ------------- Add Expenditure ----------------- */
// Create a new Transaction
// Does update with associated Account Balance Debit(-) (Database Trigger)
module.exports.addExpenditure = async (req, res) => {
  try {
    // Validate request
    if (!req.body.acctid) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    // Create a Transaction
    const transaction = {
      ACC_ID: req.body.acctid,
      TRANS_DESCRIPTION: req.body.purpose,
      TRANS_AMOUNT: req.body.transactionamount,
      TRANS_DATE: req.body.transactiondate,
      TRANS_TYPE: req.body.transactiontype,
      CATEGORY_ID: req.body.transactioncategory
    };

    const accountDetails = await Account.findByPk(req.body.acctid);
    console.log(`Retrieving account balance for`, accountDetails);
    if (!accountDetails) {
      return res.status(400).send("Unable to retrieve account details");
    }
    const accountBalance = accountDetails.ACC_BALANCE;
    const transactionAmount = transaction.TRANS_AMOUNT;
    if (accountBalance - transactionAmount < 0) {
      return res
        .status(400)
        .send("Account has insufficient balance for deduction!");
    }
    // Save Transaction in the database
    const createTransaction = await Transaction.create(transaction);
    if (!createTransaction) {
      return res.status(400).send("Unable to create transaction");
    }
    res.status(200).send(createTransaction);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occured while creating the Transaction."
    });
  }
};

/* -------------- Add Cash ----------------*/
// Create a new Transaction
// Does update with associated Account Balance (-) (Database Trigger)
module.exports.addCash = (req, res) => {
  // Validate request
  if (!req.body.acctid) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Transaction
  const transaction = {
    ACC_ID: req.body.acctid,
    TRANS_DESCRIPTION: req.body.source,
    TRANS_AMOUNT: req.body.sum,
    TRANS_DATE: req.body.transactiondate,
    TRANS_TYPE: req.body.transactiontype,
    CATEGORY_ID: 5 // CategoryId => Revenue
  };

  // Save Transaction in the database
  Transaction.create(transaction)
    .then(data => {
      res.status(200).send(data);
    })

    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occured while creating the Transaction."
      });
    });
};

/* ---------------- Retrieve all Transaction by account ID ------------ */
// Retrieve all transaction by account ID -> Use to display table data
module.exports.findAllTransactionHistory = (req, res) => {
  const accountId = req.params.acctId;
  console.log(accountId);
  Transaction.findAll({
    where: {
      ACC_ID: accountId
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occured while retrieving transaction history."
      });
    });
};

/* ---------------- Retrive Transaction by category type by account ID -------------*/
// SELECT SUM(TRANS_AMOUNT) FROM TRANSACTION t, ACCOUNTS a
// WHERE t.ACC_ID = a.ACC_ID
// AND a.ACC_ID = 13675
// AND t.TRANS_TYPE = 'Debit'
// AND t.CATEGORY_ID = 3;

// Get Transaction Result by Catogory type
module.exports.findAllTransactionHistoryByCategory = (req, res) => {
  const accountId = req.params.accountId;
  const categoryId = req.params.categoryId;
  console.log(accountId);
  console.log(categoryId);

  Transaction.sum("TRANS_AMOUNT", {
    where: {
      ACC_ID: accountId,
      TRANS_TYPE: "Debit",
      CATEGORY_ID: categoryId
    }
  })
    .then(data => {
      console.log("SUCCESS");
      res.json({
        transactionSum: data
      });
    })
    .catch(err => {
      console.log("FAILURE");
      res.sendStatus(400).json({
        message: err
      });
    });
};

/* ---------------- Update Transaction of account ID -------------*/
/*----------------------------------------------------------------*/
module.exports.updateTransaction = async (req, res) => {
  try {
    // Validate request
    if (!req.params.acctid) {
      res.status(400).send({
        message: "Failed to update transaction. Content can not be empty!"
      });
      return;
    }
    // Updated Transaction
    const updatedTransaction = {
      accountId: req.params.acctid,
      transactionId: req.body.transactionId,
      purpose: req.body.purpose,
      transactionAmount: req.body.transactionamount,
      transactionDate: req.body.transactiondate,
      category: req.body.transactioncategory,
      transactionType: req.body.transactiontype
    };

    console.log(`Logging account Id of transaction to be updated ${req.params.acctid}, transactionID: ${req.body.transactionId}
  purpose: ${req.body.purpose}, transaction amount: ${req.body.transactionamount}, transaction date: ${req.body.transactiondate}, 
  transaction category: ${req.body.transactioncategory}, transaction type: ${req.body.transactiontype}`);

    const accountDetails = await Account.findByPk(updatedTransaction.accountId);
    console.log(`Retrieving account balance for`, accountDetails);
    if (!accountDetails) {
      return res.status(400).send("Unable to retrieve account details");
    }

    const originalTransaction = await Transaction.findOne({
      where: {
        TRANS_ID: updatedTransaction.transactionId
      }
    });
    if (!originalTransaction) {
      return res.status(400).send("Unable to retrieve transaction details");
    }
    let oldTransactionAmount = parseInt(originalTransaction.TRANS_AMOUNT);
    console.log(typeof oldTransactionAmount);
    console.log("Original Transaction", originalTransaction);
    console.log("Original Transaction Amount is " + oldTransactionAmount);

    let accountBalance = parseInt(accountDetails.ACC_BALANCE);
    let newTransactionAmount = parseInt(updatedTransaction.transactionAmount);

    console.log("Account Balance is " + accountBalance);
    console.log("Account Balance is type " + typeof accountBalance);
    console.log("Old transaction amount is " + oldTransactionAmount);
    console.log(
      "Old transaction amount is type " + typeof oldTransactionAmount
    );
    console.log("New transaction amount is " + newTransactionAmount);
    console.log(
      "New transaction amount is type " + typeof newTransactionAmount
    );

    //Recompute Account Balance depending on transaction type
    if (originalTransaction.TRANS_TYPE === "Credit") {
      console.log("In credit");
      newAccountBalance =
        accountBalance - oldTransactionAmount + newTransactionAmount;
      console.log("New Account Balance is " + newAccountBalance);
      console.log(
        "New calculated account balance is type " + typeof newAccountBalance
      );
    }
    if (originalTransaction.TRANS_TYPE === "Debit") {
      console.log("In debit");
      newAccountBalance =
        accountBalance + oldTransactionAmount - newTransactionAmount;
      console.log("New Account Balance is " + newAccountBalance);
      console.log(
        "New calculated account balance is type " + typeof newAccountBalance
      );
    }

    if (newAccountBalance < 0) {
      return res
        .status(400)
        .send("Account has insufficient balance for deduction!");
    }

    // Update updated Transaction in the database
    const updateTransaction = await Transaction.update(
      {
        TRANS_DESCRIPTION: updatedTransaction.purpose,
        TRANS_AMOUNT: updatedTransaction.transactionAmount,
        TRANS_DATE: updatedTransaction.transactionDate,
        CATEGORY_ID: updatedTransaction.category
      },
      {
        where: {
          TRANS_ID: updatedTransaction.transactionId,
          TRANS_TYPE: updatedTransaction.transactionType
        }
      }
    );

    if (updateTransaction != 1) {
      return res.status(400).send("Unable to update transaction");
    }

    const updatedAccountBalance = await Account.update(
      {
        ACC_BALANCE: newAccountBalance
      },
      {
        where: {
          ACC_ID: accountDetails.ACC_ID
        }
      }
    );

    if (updatedAccountBalance != 1) {
      return res
        .status(400)
        .send("Unable to update account balance after updating transaction");
    }
    //Update account balance
    res.status(200).send({
      message: `Updated transaction successfully for AccountID: ${updatedTransaction.accountId}, TransactionId: ${updatedTransaction.transactionId}.`
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occured while updating the Transaction."
    });
  }
};

/* ---------------- Delete Transaction -------------*/
/*----------------------------------------------------------------*/
module.exports.deleteTransaction = async (req, res) => {
  try {
    const accountId = req.params.acctid;
    const transactionId = req.params.transactionId;
    console.log(
      `Account Id to be deleted transaction: ${accountId}, Transaction Id to be deleted: ${transactionId}`
    );

    const accountDetails = await Account.findByPk(accountId);
    console.log(`Retrieving account balance for`, accountDetails);
    if (!accountDetails) {
      return res.status(400).send("Unable to retrieve account details");
    }

    const toBeDeletedTransaction = await Transaction.findOne({
      where: {
        TRANS_ID: transactionId
      }
    });
    if (!toBeDeletedTransaction) {
      return res.status(400).send("Unable to retrieve transaction details");
    }
    let toBeDeletedTransactionAmount = parseInt(
      toBeDeletedTransaction.TRANS_AMOUNT
    );
    console.log(typeof toBeDeletedTransactionAmount);
    console.log("Original Transaction", toBeDeletedTransaction);
    console.log(
      "Original Transaction Amount is " + toBeDeletedTransactionAmount
    );

    let accountBalance = parseInt(accountDetails.ACC_BALANCE);

    console.log("Account Balance is " + accountBalance);
    console.log("Account Balance is type " + typeof accountBalance);
    console.log("Old transaction amount is " + toBeDeletedTransactionAmount);
    console.log(
      "Old transaction amount is type " + typeof toBeDeletedTransactionAmount
    );

    //Recompute Account Balance depending on transaction type
    if (toBeDeletedTransaction.TRANS_TYPE === "Credit") {
      console.log("In credit");
      newAccountBalance = accountBalance - toBeDeletedTransactionAmount;
      console.log("New Account Balance is " + newAccountBalance);
      console.log(
        "New calculated account balance is type " + typeof newAccountBalance
      );
    }
    if (toBeDeletedTransaction.TRANS_TYPE === "Debit") {
      console.log("In debit");
      newAccountBalance = accountBalance + toBeDeletedTransactionAmount;
      console.log("New Account Balance is " + newAccountBalance);
      console.log(
        "New calculated account balance is type " + typeof newAccountBalance
      );
    }

    const deletedtransaction = await Transaction.destroy({
      where: {
        TRANS_ID: transactionId
      },
      force: true
    });
    console.log(`To be deleted Transaction: ${deletedtransaction}`);
    if (deletedtransaction != 1) {
      return res.status(400).send("Unable to delete transaction");
    }

    const updatedAccountBalance = await Account.update(
      {
        ACC_BALANCE: newAccountBalance
      },
      {
        where: {
          ACC_ID: accountDetails.ACC_ID
        }
      }
    );

    if (updatedAccountBalance != 1) {
      return res
        .status(400)
        .send("Unable to update account balance after deleting transaction");
    }

    res.status(200).send({
      message: `Deleted transaction successfully for AccountID: ${accountId}, TransactionId: ${transactionId}.`
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occured while deleting the Transaction."
    });
  }
};
