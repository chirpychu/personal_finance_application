const users = require("../controllers/UsersController.js");
const accounts = require("../controllers/AccountsController.js");
const currency = require("../controllers/CurrencyController.js");
const category = require("../controllers/CategoryController.js");
const transaction = require("../controllers/TransactionController.js");
const router = require("express").Router();

module.exports = app => {
  // define the home page route
  router.get("/", (req, res) => {
    res.send("Personal Finance Application Home API");
  });

  /* ------------ User Routes-----------------  */
  // Create a new User
  router.post("/auth/register", users.register);

  // Retrieve all User
  router.post("/auth/login", users.login);

  // Retrieve a single user with userId
  router.get("/profile", users.getProfile);

  // Reset password
  router.post("/setting/resetpassword", users.resetPassword);

  // Retrieve all registered users
  router.get("/admin/retrieveusers", users.retrieveRegisteredUsers);

  // ADMIN - Create New User
  router.post("/admin/addnewuser", users.addNewUser);

  // ADMIN - Update registered users
  router.post("/admin/updateuser/:userid", users.updateRegisteredUser);

  // ADMIN - Delete User by userid
  router.delete("/admin/deleteuser/:userid", users.deleteRegisteredUser);

  /*---------------------------------------------- */

  /* ------------ Account Routes ------------------ */
  // Retrieve account details from an user account
  // 1. Use to retrieve account balance
  // 2. Use to retrieve account currency type assigned
  router.get("/accountDetails/:accountId", accounts.getAccountDetailsById);

  // Update currency to be display for account
  router.put(
    "/setting/currency/account/:accountId/currency/:currencyId",
    accounts.changeCurrency
  );

  /* -------------------------------------------- */

  /* ------------ Currency Routes ------------------ */

  // Retrieve all currency
  router.get("/setting/currency", currency.findAllCurrency);

  /* -------------------------------------------- */

  /* ------------ Category Routes ------------------ */
  // Retrieve all Category
  router.get("/retrieve-category", category.findAllCategory);

  /* -------------------------------------------- */

  /* ------------ Transaction Routes ------------------ */
  // Create a new Transaction for expenditure DEBIT(-) -> also updates account balance in associated account
  router.post("/transaction-expense", transaction.addExpenditure);

  // Create a new Transaction for revenue CREDIT(+) -> also updates account balance in associated account
  router.post("/transaction-revenue", transaction.addCash);

  // Retrieve all Transaction -> Use for displaying transaction table of an user account
  router.get(
    "/transaction/account/:acctId",
    transaction.findAllTransactionHistory
  );

  // Retrieve all Transaction by category -> Use for displaying respective category card
  router.get(
    "/transaction/account/:accountId/category/:categoryId",
    transaction.findAllTransactionHistoryByCategory
  );

  // // Retrieve a single Transaction with id
  // router.get("/:id", transaction.findOne);

  // Update a transaction with id -> Admin and client USE
  router.put("/transaction/account/:acctid", transaction.updateTransaction);

  // Delete a Transaction with id -> Both client and Admin
  router.delete(
    "/transaction/deletion/account/:acctid/:transactionId",
    transaction.deleteTransaction
  );

  /* -------------------------------------------- */

  // // Delete all Transaction -> Admin USE ONLY
  // router.delete("/", transaction.deleteAll);

  app.use("/api", router);
};
