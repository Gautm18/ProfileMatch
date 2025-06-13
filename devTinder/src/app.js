const express = require("express");
const connectDB = require("./congig/database");
const app = express();
var cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());



const authRouter = require("./routes/authRoute")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

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
