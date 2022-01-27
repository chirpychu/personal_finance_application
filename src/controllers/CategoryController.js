//Implementation of Category routes
const model = require("../models/index.js");
const Category = model.CATEGORY;

// Find all category
module.exports.findAllCategory = (req, res) => {
  Category.findAll({
    where: { STAT: "A" }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Some error occured while retrieving the categories.`
      });
    });
};
