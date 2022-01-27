module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "CATEGORY",
    {
      CATEGORY_ID: {
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

  return Category;
};
