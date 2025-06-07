const express = require("express");
const connectDB = require("./congig/database");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validator");

app.use(express.json());

app.post("/signup", async (req, res) => {

  const {firstName, lastName, emailId, password} = req.body
  try {
    validateSignUpData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    console.log("Request body:", req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send(`User ${user?.firstName} added successfully!`);
  } catch (e) {
    console.error("Error saving user:", e);
    res.status(500).send("Error:" + e.message);
  }
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
