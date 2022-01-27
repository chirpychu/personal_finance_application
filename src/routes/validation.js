// Validation
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

//Register Validation

function registerValidation(data) {
  const schema = Joi.object({
    user_name: Joi.string()
      .min(6)
      .required(),
    user_email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required()
  });
  return schema.validate(data);
}

function loginValidation(data) {
  const schema = Joi.object({
    user_email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  });
  return schema.validate(data);
}

function genAccessToken(userJoinAccount) {
  const userId = userJoinAccount[userJoinAccount.length - 1].USER_ID;
  const userName = userJoinAccount[userJoinAccount.length - 1].USER_NAME;
  const isAdmin = userJoinAccount[userJoinAccount.length - 1].IS_ADMIN;
  const {
    dataValues: { ACC_ID: acctId }
  } = userJoinAccount[userJoinAccount.length - 1].ACCOUNT;

  console.log(
    `Generating Access Token for following: User ID is ${userId}. User Name is ${userName}. Is Admin: ${isAdmin}. Account ID is ${acctId}`
  );
  const tokenPayload = { userId, acctId, userName, isAdmin };
  console.log(tokenPayload);
  const accessToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
    expiresIn: 1440
  });
  return accessToken;
}

function resetPasswordValidation(data) {
  const schema = Joi.object({
    userId: Joi.number()
      .integer()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });
  return schema.validate(data);
}

function createNewUserValidation(data) {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .required(),
    useremail: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    isAdmin: Joi.string(),
    status: Joi.string()
  });
  return schema.validate(data);
}

module.exports = {
  registerValidation: registerValidation,
  loginValidation: loginValidation,
  genAccessToken: genAccessToken,
  resetPasswordValidation: resetPasswordValidation,
  createNewUserValidation: createNewUserValidation
};
