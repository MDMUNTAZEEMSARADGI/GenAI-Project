const mongoose = require("mongoose");

async function connectToDb() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
}


module.exports = connectToDb