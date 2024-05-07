const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js"); // for Encrypting password
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ username: request.body.username });
    // User Validation
    !user && response.status(401).json("Wrong User Credentials!"); // Short if Statement
    // if (!user) {
    //   response.status(401).json("Wrong User Credentials");
    //   return;
    // }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    // Password Validation
    originalPassword !== request.body.password &&
      response.status(401).json("Wrong Password Credentials!"); // Short if Statement

    // if (originalPassword !== request.body.password) {
    //   response.status(401).json("Wrong Password Credentials");
    //   return;
    // }

    // using json web token
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;

    // return User (Displaying Response)
    response.status(200).json({ others, accessToken });
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;
