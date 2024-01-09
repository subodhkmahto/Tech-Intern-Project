
const registerUser= (req,res)=>{

    //take data from frontentend part;
    //check data is not empty
    //check data is allredy present or not
    //if data is present then redirect the login page
    //if not user register then data is save in db
    //

    res.status(200).json({message:"user register sucess full"});
}


module.exports=registerUser;