module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "USERS",
    {
      USER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      USER_NAME: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      USER_EMAIL: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
      },
      PASSWORD: {
        type: DataTypes.STRING,
        allowNull: false
      },
      FIRST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      LAST_NAME: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      IS_ADMIN: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      LAST_LOGIN: {
        type: DataTypes.DATE,
        allowNull: true
      },
      STAT: {
        type: DataTypes.STRING(1),
        defaultValue: "A",
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  );

  return User;
};
