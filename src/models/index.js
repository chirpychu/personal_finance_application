const fs = require("fs");
const path = require("path");
const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  define: {
    timestamps: true,
    createdAt: "CRE_ON",
    updatedAt: "UPD_ON"
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
const models = {};

// Initialize models
fs.readdirSync(__dirname)
  .filter(file => file !== "index.js")
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });

console.log(models);
models.sequelize = sequelize;
models.Sequelize = Sequelize;

models.ACCOUNTS.belongsTo(models.USERS, {
  foreignKey: "USER_ID",
  targetKey: "USER_ID"
});

models.ACCOUNTS.hasMany(models.TRANSACTION, {
  foreignKey: "ACC_ID",
  targetKey: "ACC_ID"
});

models.USERS.hasOne(models.ACCOUNTS, {
  foreignKey: "USER_ID",
  targetKey: "USER_ID"
});

module.exports = models;
