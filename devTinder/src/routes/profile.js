const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
      console.log(user.firstName);
      res.send(user);
    } catch (e) {
      res.status(404).send(e);
    }
  });

  module.exports = profileRouter