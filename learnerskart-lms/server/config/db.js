const mongoose = require('mongoose');

// Load Mock Mongoose interceptor first if mock DB is enabled
if (process.env.USE_MOCK_DB === 'true') {
  require('./mockMongoose');
}

const connectDB = async () => {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('--------------------------------------------------');
    console.log('DATABASE: Running in local JSON-file Database mode.');
    console.log('Data will be persisted in server/data/json_db/');
    console.log('--------------------------------------------------');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnerskart_lms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('\n==================================================');
    console.log('                     [TIP]');
    console.log('If you do not have MongoDB running locally, you can');
    console.log('run this project using a local JSON database.');
    console.log('Simply edit the server/.env file and add:');
    console.log('  USE_MOCK_DB=true');
    console.log('Then restart the server to run instantly!');
    console.log('==================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
