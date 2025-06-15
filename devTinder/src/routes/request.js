const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      //CHECKING IF STATUS IS NOT DIFFERENT THAT WHAT WE DEFINED

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      

      //CHECKING IF USER ID IS COMING ONLY FROM OUR DATABASE, NOT A RANDOM USER ID

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //CHECKING IF USER CONNECTION REQUEST IS NOT DUPLICATING AND IF SENT TO ONE USER TO ANOTHER THEN ANOTHER CAN'T SEND THE REQUEST BACK TO THAT USER

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      //THERE IS ONE MORE CHECK THAT USERS CAN NOT SEND CONNECTION REQUEST TO THEMSELVES(THAT LOGIC EITHER WE CAN WRITE IT HERE OR CAN HANDLE FROM MODEL LEVEL(BETTER TO WRITE IN MODEL LEVEL TO LEARN THE CONCEPT OF "PRE"))

      const data = await connectionRequest.save();

      res.json({
        message: "connection request sent successfully!!",
        data,
      });
    } catch (e) {
      res.status(400).send("ERROR: " + e.message);
    }
  }
);

module.exports = requestRouter;
