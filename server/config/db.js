const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`   Full error: ${error}`);
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   💡 Check your internet connection and MongoDB URI hostname');
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.error('   💡 Check your MongoDB username and password in MONGO_URI');
    } else if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('network')) {
      console.error('   💡 Whitelist your IP in MongoDB Atlas → Network Access → Add Current IP');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
