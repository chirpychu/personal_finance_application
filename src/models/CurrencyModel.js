module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define(
    "CURRENCY",
    {
      CURRENCY_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      NAME: {
        type: DataTypes.STRING(50),
        unique: true
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

  return Currency;
};
