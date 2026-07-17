const mongoose = require('mongoose');
const dns = require('dns');

// Force DNS servers to Google DNS to bypass local querySrv resolution failures in Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('⚠️ Could not set custom DNS servers:', dnsErr.message);
}

const connectDB = async () => {
  const ATLAS_URI = 'mongodb+srv://raghav2002jha:raghav@cluster0.aklpzei.mongodb.net/acculedger?retryWrites=true&w=majority';
  const LOCAL_URI = 'mongodb://127.0.0.1:27017/acculedger';
  const mongoURI = process.env.MONGO_URI || ATLAS_URI;

  try {
    console.log('⏳ Connecting to primary MongoDB...');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.warn('⚠️ Primary MongoDB connection failed:', error.message);
    
    // Attempt local fallback if primary failed
    if (mongoURI !== LOCAL_URI) {
      try {
        console.log('⏳ Attempting local MongoDB fallback (127.0.0.1:27017)...');
        await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 4000 });
        console.log('✅ Connected to local MongoDB.');
      } catch (localError) {
        console.error('❌ Local MongoDB connection failed:', localError.message);
        console.error('\n💡 Please ensure local MongoDB is running, or verify your connection credentials in .env file.\n');
      }
    }
  }
};

module.exports = connectDB;
