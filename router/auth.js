const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../db/conn");
const User = require("../model/UserSchema");

router.get("/", (req, res) => {
  res.send(`Hello world from the server router js`);
});

router.post("/register", async (req, res) => {
  const { username, name, email, password, cpassword, number } = req.body;

  if (!username || !name || !email || !password || !cpassword || !number) {
    return res.status(422).json({ error: "Pls filled the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "password are not matching" });
    }
    const user = new User({
      username,
      name,
      email,
      password,
      cpassword,
      number,
    });

    await user.save();
    res.status(201).json({ message: "user registered successfuly" });
  } catch (err) {
    console.log(err);
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();

      // res.cookie("jwtoken",token,{
      //   expire:new Date(Date.now()+25892000000),
      //   httpOnly:true
      // })

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Password" });
      } else {
        res.json({ message: "user login sucessfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

//Lougout ka page
router.get("/", (req, res) => {
  console.log("Hello my Logout Page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
