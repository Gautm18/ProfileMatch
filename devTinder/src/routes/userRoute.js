const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName age gender about skills";

//THIS API WILL GET ALL THE PENDING REQUEST FOR THE LOGGED IN USER
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //populate("fromUserId", ["firstName", "lastName"]) -- in this way we can also populate. either way we can opt

    res.json({
      message: "Data fetched successfully!!",
      data: connectionRequests,
    });
  } catch (e) {
    res.status(404).send("ERROR : " + e.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
    });

    res.json({ data });
  } catch (e) {
    res.status(404).send("ERROR : " + e.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50? 50:limit;

    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUseId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set(); //this data structure is just kind of an array, which will take only unique element. if you try to push repeated value then it will not accept.
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    console.log(hideUserFromFeed);

    const users = await User.find({
        $and: [
            {_id: {$nin: Array.from(hideUserFromFeed)}},
            {_id: {$ne: loggedInUser._id}}
        ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(users);
  } catch (e) {
    res.status(404).send("ERROR : " + e.message);
  }
});

module.exports = userRouter