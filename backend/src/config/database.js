// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB Connected Successfully');
//   } catch (error) {
//     console.error('MongoDB Connection Error:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGODB_URI.replace(/:[^:@]+@/, ":****@"));

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected!");
    console.log(conn.connection.host);
  } catch (err) {
    console.error("Full Error:");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;