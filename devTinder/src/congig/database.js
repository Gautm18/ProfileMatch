const mongoose = require('mongoose')




//this mongoose.connect will alwas return promise, and we can play with the method of promises ehile calling the function.
const connectDB = async() => {

  await mongoose.connect("mongodb+srv://gshandilya44:Dp6Aiiwe4gxExwKv@nodejslearning.7xzehyk.mongodb.net/NodeJSLearning1")

}

module.exports = connectDB;
