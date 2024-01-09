const express=require("express");
const registerUser  = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post( registerUser.loginUser);

//secured routes
router.route("/logout").post( verifyJWT , registerUser.loggedOutUser);

module.exports=router;