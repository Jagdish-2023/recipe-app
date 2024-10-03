const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

async function initializeDB() {
  try {
    const connection = await mongoose.connect(mongoURI);
    if (connection) {
      console.log("DB connected successfully.");
    }
  } catch (error) {
    console.log("Connection failed", error);
  }
}

module.exports = initializeDB;
