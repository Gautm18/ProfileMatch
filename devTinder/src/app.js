const express = require("express");
const connectDB = require("./congig/database");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validator");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());


app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("connection request sent");

  res.send(user.firstName + " sent the connection request!!");
});

connectDB()
  .then(() => {
    console.log("✅ DB connected successfully!");
    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000...");
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB :", err);
  });
