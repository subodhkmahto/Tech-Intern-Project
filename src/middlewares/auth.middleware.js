const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyJWT = async (req, res, next) => {

    try {
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const decodedToken = jwt.verify(token, "OSHMTECH");
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Invalid Access token" });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    
};

module.exports = verifyJWT;
