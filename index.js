const express = require("express");
const bodyParser = require("body-parser");
const route = require("./src/routes/user.route");
const dbConnection = require("./src/config/db");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const baseUserURL = "/api/v1/user";
app.use(baseUserURL, route);

const port = 8080;

dbConnection();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
