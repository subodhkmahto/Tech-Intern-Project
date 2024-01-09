const mongoose=require("mongoose");

const url="mongodb://127.0.0.1:27017/OSHMPROJECT";

const dbConnection = async () =>{

 mongoose.connect(url)
                      .then((db)=>{
                         console.log(`Databse is connection succesfull and ${mongoose.connection.host}`)})
                      .catch((error)=>(console.error(error)));

}

module.exports=dbConnection;