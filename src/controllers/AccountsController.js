//Implementation of account routes
const model = require("../models/index.js");
const Account = model.ACCOUNTS;

// Get Balance
module.exports.getAccountDetailsById = (req, res) => {
  const acct_id = req.params.accountId;
  Account.findByPk(acct_id)
    .then(account => {
      res.send(account);
    })
    .catch(err => {
      res.status(500).send({
        message: `Error retrieveing account balance with account id: ${acct_id}`
      });
    });
};

// Update Currency to be display on account dashboard
module.exports.changeCurrency = (req, res) => {
  const updatedCurrency = req.params.currencyId;
  const account_id = req.params.accountId;
  console.log(`Currency to be updated ${updatedCurrency}`);
  console.log(`Account to be updated ${updatedCurrency}`);
  Account.update(
    { CURRENCY_ID: updatedCurrency },
    { where: { ACC_ID: account_id } }
  )
    .then(rowUpdated => {
      if (rowUpdated == 1) {
        res.send({
          message: `CurrencyId: ${updatedCurrency} updated successfully for AccountID: ${account_id}.`
        });
      } else {
        res.send({
          message: `Unable to update currency with id: ${updatedCurrency}. Maybe currency id does not exist or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Account with currency with id: ${updatedCurrency}`
      });
    });
};
