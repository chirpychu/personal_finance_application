//Implementation of user routes
const model = require("../models/index.js");
const User = model.USERS;
const Account = model.ACCOUNTS;

const Op = model.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../routes/validation");

// REGISTER
module.exports.register = async (req, res) => {
  //Validate data before make a user
  const validationResult = auth.registerValidation(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  //Check if user is already in the database
  const emailExist = await User.findOne({
    where: { USER_EMAIL: req.body.user_email }
  });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    USER_NAME: req.body.user_name,
    USER_EMAIL: req.body.user_email,
    PASSWORD: hashedPassword,
    FIRST_NAME: req.body.first_name,
    LAST_NAME: req.body.last_name,
    CRE_ON: new Date()
  });
  const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
  const savedUser = await user.save();
  res.json({
    token,
    email: user.USER_EMAIL,
    username: user.USER_NAME,
    firstname: user.FIRST_NAME,
    lastname: user.LAST_NAME
  });
  //res.send({ userId: user.USER_ID });
};

// LOGIIN
module.exports.login = async (req, res) => {
  //Validate the data before we accept login request
  console.log(req.body);
  const validationResult = auth.loginValidation(req.body);
  if (validationResult.error) {
    return res.status(401).send(validationResult.error.details[0].message);
  }

  //Check if user is already in the database
  const user = await User.findOne({
    where: { USER_EMAIL: req.body.user_email, STAT: "A" }
  });
  if (!user) {
    return res.status(400).send("Email does not exist!"); //TO change to email or password doesnt exist
  }

  // Check if password is CORRECT
  const validPass = await bcrypt.compare(req.body.password, user.PASSWORD);
  if (!validPass) {
    return res.status(400).send("Invalid password"); //TO change to email or password doesnt exist
  }

  console.log(process.env.TOKEN_SECRET);

  const usersJoinAccount = await User.findAll({
    include: [
      {
        model: Account
      }
    ],
    where: { USER_EMAIL: req.body.user_email }
  });
  console.log(typeof usersJoinAccount);
  console.log(JSON.stringify(usersJoinAccount, null, 2));

  // Create and assign a token
  const token = auth.genAccessToken(usersJoinAccount);

  res.header("auth-token", token).send(token);
};

// Reset Password
module.exports.resetPassword = (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const saltRounds = 10;
  console.log(`UserId to be changed: ${userId}`);
  console.log(`UserId password to be changed to: ${password}`);

  const validationResult = auth.resetPasswordValidation(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  //Hash the password
  const hashPassword = bcrypt.hashSync(password, saltRounds);
  User.update(
    { PASSWORD: hashPassword },
    {
      where: { USER_ID: userId }
    }
  )
    .then(userUpdated => {
      if (userUpdated == 1) {
        res.send({
          message: `userId: ${userId} updated successfully for userId: ${userId}.`
        });
      } else {
        res.send({
          message: `Unable to change password for userid: ${userId}. Maybe user id does not exist or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error changing User with password with id: ${userId}`
      });
    });
};

/* ---------------- Add New User ------------------- */
module.exports.addNewUser = async (req, res) => {
  try {
    console.log(req.body);
    //Validate data before make a user
    const validationResult = auth.createNewUserValidation(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }

    //Check if user is already in the database
    const emailExist = await User.findOne({
      where: { USER_EMAIL: req.body.useremail }
    });
    if (emailExist) {
      return res.status(400).send("Email already exists");
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      USER_NAME: req.body.username,
      USER_EMAIL: req.body.useremail,
      PASSWORD: hashedPassword,
      FIRST_NAME: req.body.firstname,
      LAST_NAME: req.body.lastname,
      IS_ADMIN: req.body.isAdmin,
      STAT: req.body.status,
      LAST_LOGIN: null,
      CRE_ON: new Date(),
      UPD_ON: new Date()
    });

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    const savedUser = await user.save();
    res.json({
      token,
      email: user.USER_EMAIL,
      username: user.USER_NAME,
      firstname: user.FIRST_NAME,
      lastname: user.LAST_NAME
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occured while creating the User."
    });
  }
};

/* ---------------- Retrieve all Users  ------------ */
// [ADMIN USE onlu] Use to display table data
module.exports.retrieveRegisteredUsers = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving registered users."
      });
    });
};

// [ADMIN only]
module.exports.updateRegisteredUser = async (req, res) => {
  try {
    // Validate request
    if (!req.params.userid) {
      res.status(400).send({
        message: "Failed to update user. Content can not be empty!"
      });
    }
    // Updated User
    const updatedUser = {
      userid: req.params.userid,
      username: req.body.username,
      useremail: req.body.useremail,
      stat: req.body.stat,
      password: req.body.password
    };

    console.log(`Logging updatedUser details`, updatedUser);
    console.log(`Logging updatedUser password body: ${req.body.password}`);
    console.log(`Logging updatedUser password: ${updatedUser.password}`);
    const serverSidePasswordValidation = {
      userId: req.params.userid,
      password: req.body.password
    };

    const validationResult = auth.resetPasswordValidation(
      serverSidePasswordValidation
    );
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details[0].message);
    }
    const saltRounds = 10;
    //Hash the password
    const hashPassword = bcrypt.hashSync(req.body.password, saltRounds);

    console.log(`Logging user Id of user to be updated ${req.params.userid}, Username: ${req.body.username}
    UserEmail: ${req.body.useremail}, Stat: ${req.body.stat}, password: ${hashPassword}`);

    const UserUpdated = await User.update(
      {
        USER_NAME: updatedUser.username,
        USER_EMAIL: updatedUser.useremail,
        STAT: updatedUser.stat,
        PASSWORD: hashPassword,
        UPD_ON: new Date().toJSON()
      },
      {
        where: { USER_ID: updatedUser.userid }
      }
    );

    if (!UserUpdated) {
      return res.status(400).send("Failed to update User");
    }

    //Updation User Successful
    res.status(200).send({
      message: `Updated user successfully for UserID: ${updatedUser.userid}`
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occured while updating the User."
    });
  }
};

// [ADMIN USE ONLY] - Deletion of user
module.exports.deleteRegisteredUser = async (req, res) => {
  try {
    // Validate request
    if (!req.params.userid) {
      res.status(400).send({
        message: "Failed to delete user. Content can not be empty!"
      });
    }

    const userId = req.params.userid;

    const deleteUserAccount = await Account.destroy({
      where: {
        USER_ID: userId
      },
      force: true
    });
    console.log(
      `Deleting Account of userid: ${userId}, result is: ${deleteUserAccount}`
    );
    if (deleteUserAccount != 1) {
      return res
        .status(400)
        .send(
          `Unable to delete account of userid ${userId}. Maybe accountId does not exist`
        );
    }

    const deleteUser = await User.destroy({
      where: {
        USER_ID: userId
      },
      force: true
    });
    console.log(`Deleting User of userid: ${userId}, result is: ${deleteUser}`);
    if (deleteUser != 1) {
      return res
        .status(400)
        .send(
          `Unable to delete user of userid ${userId}. Maybe userId does not exist`
        );
    }
    res.status(200).send({
      message: `Deleted User successfully of userID: ${userId}.`
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occured while deleting the User."
    });
  }
};

// Fetch Profile [Not in used]
module.exports.getProfile = (req, res) => {
  var decoded = jwt.verify(req.headers["auth-token"], process.env.TOKEN_SECRET);

  User.findOne({
    where: {
      USER_ID: decoded.userId
    }
  })
    .then(user => {
      if (user) {
        res.send({
          UserId: user.USER_ID,
          Username: user.USER_NAME,
          Email: user.USER_EMAIL,
          FirstName: user.FIRST_NAME,
          LastName: user.LAST_NAME
        });
      } else {
        res.send("User does not exist");
      }
    })
    .catch(err => {
      res.send("error:" + err);
    });
};
