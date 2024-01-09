
const registerUser= (req,res)=>{

    //take data from frontentend part;
    //check data is not empty means email or password is not empty
    //check data (user) is allredy present or not//username of email
    //if data is present then redirect the login page
    //if not user register then data is save in db
    //create user object-create entry in db
    // remove password and refresh token field from response
    //check for user creation
    //return res;

    const {fullname,username,password}=req.body;
    console.log(fullname,username,password);

    res.status(200).json({message:"user register sucess full"});
}


module.exports=registerUser;