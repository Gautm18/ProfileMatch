const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      //learn about enum , it is used for restriction/validation. you can add your custum validator but enum will make your work easier
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//NEVER CREATE INDEX UNNECESSARILY IS ALSO NOT A GOOD PRACTICE, SO PLAN IT FIRST WHERE YOU WANT/NEED TO GIVE INDEX

connectionRequestSchema.index({fromUserId:1, toUserId:1})


//CHECK IF FROM USER ID IS SAME AS TO USER ID (MEANS CHECK IF USERS ARE NOT SENDING THE REQUEST TO THEMSELVES)

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can not send connection request to yourself!!")
    }

    //never forget to write next() at the end of a middleware

    next()

})

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
