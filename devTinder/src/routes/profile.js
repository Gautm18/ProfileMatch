const express = require("express");
const authRouter = express.Router();


app.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      console.log(user.firstName);
      res.send(user);
    } catch (e) {
      res.status(404).send(e);
    }
  });