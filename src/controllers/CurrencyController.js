//Implementation of Currency routes
const model = require("../models/index.js");
const Currency = model.CURRENCY;

// Find all currency
module.exports.findAllCurrency = (req, res) => {
  Currency.findAll({
    where: { STAT: "A" }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Some error occured while retrieving the currencies.`
      });
    });
};
