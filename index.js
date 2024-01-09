const express=require("express");
const { route } = require("./src/routes/user.route");
const app=express();





app.use("api/v1/user",route);


const port=8080;

app.listen(port,()=>{
    console.log(`server is running at port http://localhost:${port}`);
})
