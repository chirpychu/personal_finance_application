module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "ACCOUNTS",
    {
      ACC_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      USER_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      ACC_TYPE: {
        type: DataTypes.STRING(10)
      },
      ACC_NAME: {
        type: DataTypes.STRING(50)
      },
      ACC_BALANCE: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      CURRENCY_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      STAT: {
        type: DataTypes.STRING(1),
        defaultValue: "A"
      }
    },
    {
      freezeTableName: true
    }
  );

  return Account;
};
