const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/OSHMPROJECT";

const dbConnection = async () => {
    try {
        await mongoose.connect(url);
        console.log(`Database connection successful: ${mongoose.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
};

module.exports = dbConnection;
