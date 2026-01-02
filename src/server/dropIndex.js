const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../config.env') });

const DB = process.env.DATABASE;

mongoose.connect(DB).then(async (con) => {
  console.log('MongoDB Connected');
  
  try {
    // Drop the unique index on name field
    const result = await mongoose.connection.collection('dishes').dropIndex('name_1');
    console.log('✅ Dropped name_1 index:', result);
  } catch (error) {
    console.log('⚠️ Index not found or error:', error.message);
  }
  
  process.exit(0);
}).catch((err) => {
  console.log('Connection failed:', err.message);
  process.exit(1);
});
