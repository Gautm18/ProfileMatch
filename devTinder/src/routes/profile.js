const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validator")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user.firstName);
    res.send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
   try{
   
    if( !validateEditProfileData(req)){
        throw new Error("ERROR: please the fields which you are trying to edit")
    }

    const loggedinUser = req.user;
    console.log(loggedinUser)
    Object.keys(req.body).forEach((key)=> {loggedinUser[key] = req.body[key]})
    console.log(loggedinUser)

    await loggedinUser.save();

    //from the below method you can opt for any one method to send the response either just sending response or giving the detailed message via json

    //res.send("user updated successfully!!")

    res.json({message:"user updated successfully!!",
      data: loggedinUser
    });

   }
   catch(e){
    res.status(404).send("Error:"+e)
   }
});


// MAKE A PATCH API FOR EDIT PASSWORD AS WELL - HOMEWORK.

module.exports = profileRouter;
