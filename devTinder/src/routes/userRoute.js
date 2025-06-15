const express = require('express')
const userRouter =express.Router()
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")

const USER_SAFE_DATA = "firstName lastName age gender about skills";

//THIS API WILL GET ALL THE PENDING REQUEST FOR THE LOGGED IN USER
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try{

        const loggedInUser = req.user

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate(
            "fromUserId",
            USER_SAFE_DATA
        )
        //populate("fromUserId", ["firstName", "lastName"]) -- in this way we can also populate. either way we can opt

        res.json({
            message:"Data fetched successfully!!",
            data : connectionRequests
        })

    }
    catch(e){
        res.status(404).send("ERROR : " + e.message)
    }
})

userRouter.get("/user/connection", userAuth, async(req,res)=>{
    try{

       const loggedInUser = req.user;

       const connectionRequests = await ConnectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id, status: "accepted"},
            {fromUserId: loggedInUser._id, status: "accepted"},
        ],

       })
       .populate("fromUserId", USER_SAFE_DATA)
       .populate("TOUserId", USER_SAFE_DATA)


       const data = connectionRequests.map((row)=> {
        if (row.fromUserId._id.toString()=== loggedInUser._id.toString()){
            return row.toUserId;
        }
       })

       res.json({data})

    }
    catch(e){
        res.status(404).send("ERROR : " + e.message)
    }
})

module.exports = userRouter