const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8081;

app.use(morgan("combined"));
app.use(cors());

// Middleware
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Route Middlewares
require("./routes/routes.js")(app);

// Get Status Of Backend server app
app.get("/status", (req, res) => {
  res.json({ message: "Welcome to Personal Finance App" });
});

// Data Models
const db = require("./models/index.js");

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  //initial();
});

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
