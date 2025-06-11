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

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
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

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isMatch = await user.validatePassword(password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }
    const token = await user.getJWT();
    res.cookie("token", token);

    res.status(200).json({ message: "Login successful!" });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Server error: " + e.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user.firstName);
    res.send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

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
