const mongoose =require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

//jwt is beare token it means jo token dega use password denge

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    password:{
        type:String,
        required:[true,'password is required'],
    },
    refeshToken:{
        type:String
    }
},
{timestamps:true});


userSchema.pre("save",async function(next){
    if (!this.isModified("password")) return next();
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
});

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

const privateKey="OSHMTECH";
userSchema.methods.genrateAccessToken=function(){
  return  jwt.sign({
    _id:this._id,
    email:this.email,
    fullname:this.fullname,
   },privateKey, { algorithm: 'RS256' },function(err,token){
    console.log(token);
   });
}


userSchema.methods.generateRefeshToken=function(){
    jwt.sign({
        _id:this._id
    },"refreshToken%@&",24*60*60);
}

userSchema.methods



const User=mongoose.model("User" ,userSchema);
module.exports=User;