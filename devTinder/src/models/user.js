const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

//improve the schema as it was in video lecture.

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type:String,
    },
    emailId: {
        type:String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true // IF YOU ARE MAKING ANY FEILD AS UNIQUE MONGO DB WILL MAKE AN INDEX AUTOMATICALLY FOR YOU
    },
    password: {
        type:String,
    },
    age:{
        type:Number,
    },
    skills:{type:[String]},
})


userSchema.index({firstName:1, lastName:1})

userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder");

    return token;

}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
   const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;

}

const User = mongoose.model("User", userSchema);

module.exports = User