const User = require("../models/user.model");

const registerUser =async (req, res) => {
    
     const { username , email , fullname , password } = req.body; // Extracting email and password from the request body
     //console.log(email, password); // Logging the received email and password
    
    // Your logic for user registration
    // - Check if data is not empty (email or password)
    // - Check if user is already present (by email or username)
    // - If user is present, redirect to the login page
    // - If not, save the data in the database
    // - Create a user object and make an entry in the database
    // - Remove sensitive information (password, refresh token) from the response
    // - Check for successful user creation
    
       if([ username, email , fullname , password ].some((field)=>{
        return field?.trim()==="";
       })){
        return res.status(400).json({message:"All fields are required"});
       }

     const existedUser=User.findOne({
        $or:[{ username },{ email }]
       });

       if(existedUser){
        res.status(409).json({message:"User is allredy existed email and password"});
       }

     const user=await  User.create({
            username:username.toLowerCase(),
            email:email,
            fullname:fullname,
            password:password
        });

       const createUser=await User.findById(user._id).select(
        "-password -refeshToken"
       );

       if(!createUser){
        return res.status(500).json({message:"Something went wrong while registering the user"})
       }
        

    // For demonstration, sending a success message in JSON
   return res.status(201).json({ message: "Created User registration successful" ,createUser});


};

module.exports = registerUser;
