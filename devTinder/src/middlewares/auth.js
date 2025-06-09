const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("token is invalid!");
    }

    const decodedOnj = await jwt.verify(token, "Dev@Tinder");

    const { _id } = decodedOnj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }

    req.user = user;
    next();
  } catch (e) {
    res.status(404).send("Error :" + e.message);
  }
};

module.exports = {
  userAuth,
};
