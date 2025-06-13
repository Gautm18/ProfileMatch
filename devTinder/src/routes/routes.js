const express = require("express");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
