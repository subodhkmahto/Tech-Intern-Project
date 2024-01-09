const express = require("express");
const {route} = require("./src/routes/user.route"); // Assuming user.route.js exports routes properly
const app = express();

// Define the base URL for user-related API endpoints
const baseUserURL = "/api/v1/user";

app.use(baseUserURL, route);

const port = 8080;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
