const express=require("express");
const registerUser  = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const router=express.Router();

router.route("/register").post(registerUser.registerUser);
router.route("/login").post( registerUser.loginUser);

//secured routes
router.route("/logout").post( verifyJWT , registerUser.loggedOutUser);
router.route("/refresh-token").post(registerUser.refreshAccessToken);

module.exports=router;