const User = require("../models/user.model");

const jwt=require("jsonwebtoken");

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Something went wrong while generating tokens");
    }
};

const registerUser = async (req, res) => {
    const { username, email, fullname, password } = req.body;

    console.log(username, email, fullname, password);
    // Check if any field is empty
    if ([username, email, fullname, password].some((field) => field?.trim()==="")) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists by username or email
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
        return res.status(409).json({ message: "User already exists with this email or username" });
    }

    try {
        // Create a new user
        const newUser = await User.create({
            username,
            email,
            fullname,
            password,
        });

        // Fetch the newly created user without sensitive information
        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Error fetching user after registration" });
        }

        // Return a success message with the created user
        return res.status(201).json({ message: "User registration successful", user: createdUser });
    } catch (error) {
        return res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

const loginUser=async (req,res) => {
    //req body=>data
    //username or eamil
    // find user 
    //password check
    // access and refreshtoken
    //send cookie

    if (!(username || email)) {
        return res.status(400).json({ message: "Username or email is required" });
    }

    try {
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid user credentials" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                user: loggedInUser,
                accessToken,
                refreshToken
            });

    } catch (error) {
        return res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

const loggedOutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id , { $set: { refreshToken: undefined } }, { new: true });

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out user", error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, 'OSHMTECH');
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ message: 'Refresh token is expired or used' });
        }

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('newRefreshToken', newRefreshToken, options)
            .json({ message: 'Access token refreshed', accessToken, refreshToken: newRefreshToken });

    } catch (error) {
        res.status(500).json({ message: 'Error refreshing access token', error: error.message });
    }
};

module.exports = { registerUser , loginUser ,loggedOutUser,refreshAccessToken};


// const User = require("../models/user.model");

// const registerUser =async (req, res) => {

//      const { username , email , fullname , password } = req.body; // Extracting email and password from the request body
//      //console.log(email, password); // Logging the received email and password
    
//     // Your logic for user registration
//     // - Check if data is not empty (email or password)
//     // - Check if user is already present (by email or username)
//     // - If user is present, redirect to the login page
//     // - If not, save the data in the database
//     // - Create a user object and make an entry in the database
//     // - Remove sensitive information (password, refresh token) from the response
//     // - Check for successful user creation
    
//        if([ username, email , fullname , password ].some((field)=>{
//         return field?.trim()==="";
//        })){
//         return res.status(400).json({message:"All fields are required"});
//        }

//      const existedUser= await User.findOne({
//         $or:[{ username },{ email }]
//        });

//        if(existedUser){
//         res.status(409).json({message:"User is allredy existed email and password"});
//        }

//      const user=await  User.create({
//             username:username,
//             email:email,
//             fullname:fullname,
//             password:password
//         });

//        const createUser=await User.findById(user._id).select(
//         "-password -refeshToken"
//        );

//        if(!createUser){
//         return res.status(500).json({message:"Something went wrong while registering the user"})
//        }
        

//     // For demonstration, sending a success message in JSON
//    return res.status(201).json({ message: "Created User registration successful" ,createUser});


// };

// module.exports = registerUser;
