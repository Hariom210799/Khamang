const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
    
    // Drop the old unique index on name
    const dishCollection = mongoose.connection.collection('dishes');
    
    console.log('\n🔍 Current indexes:');
    const indexes = await dishCollection.getIndexes();
    console.log(indexes);
    
    // Drop the simple name_1 index if it exists
    try {
      await dishCollection.dropIndex('name_1');
      console.log('\n✅ Dropped old name_1 index');
    } catch (e) {
      console.log('\n⚠️ name_1 index not found:', e.message);
    }
    
    console.log('\n🔄 Rebuilding indexes with new compound index...');
    // Mongoose will automatically create the compound index from the schema
    const Dish = require('./models/dishModel');
    await Dish.collection.dropIndexes();
    await Dish.syncIndexes();
    
    console.log('\n✅ Indexes synced!');
    console.log('📋 New indexes:');
    const newIndexes = await dishCollection.getIndexes();
    console.log(newIndexes);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

connectDB();
