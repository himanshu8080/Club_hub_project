const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

// const User = require("./model/UserSchema");
dotenv.config({ path: "./db/config.env" });

require('./db/conn');

// we link the router files to make our route easy
app.use(require('./router/auth'));


const PORT=process.env.PORT;

const middleware=(req,res,next)=>{
  console.log(`Hello my middleware`);
  next();
}

app.get("/", async (req, res) => {
  //   let user = new User(req.body);
  //  // let user = req.body;
  //   let result = await user.save();
  //   console.warn(result);
  // res.send(result);
  console.log(req.body);

  res.send("api is working");
});

app.get("/about", middleware,(req, res) => {
  res.send("Its working");
});
app.listen(PORT);
