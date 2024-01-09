const express=require("express");
const registerUser = require("../controllers/user.controller");
const router=express.Router();

router("/users").post(registerUser);


module.exports=router;