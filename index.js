const express = require("express");
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser");

const route = require("./src/routes/user.route");
const dbConnection = require("./src/config/db");
const app = express();

// Parsing middleware for JSON data
app.use(bodyParser.json({limit:"16kb"}));
app.use(bodyParser.urlencoded({ extended: true ,limit:"16kb"}));
app.use(cookieParser());


const baseUserURL = "/api/v1/user";
app.use(baseUserURL, route);

const port = 8080;

dbConnection();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
