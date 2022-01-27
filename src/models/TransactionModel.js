module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "TRANSACTION",
    {
      TRANS_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ACC_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TRANS_DESCRIPTION: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      TRANS_AMOUNT: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      TRANS_DATE: {
        type: DataTypes.DATE,
        allowNull: false
      },
      TRANS_TYPE: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CATEGORY_ID: {
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

  return Transaction;
};
