const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/khamangdb')
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.log('❌ Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Drop the old unique index and create the new compound one
async function fixDishIndexes() {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('dishes');

    // Get all current indexes
    const indexes = await collection.getIndexes();
    console.log('📋 Current indexes:', Object.keys(indexes));

    // Drop the old name_1 unique index if it exists
    if (indexes.name_1) {
      await collection.dropIndex('name_1');
      console.log('🗑️  Dropped old name_1 unique index');
    }

    // Create the new compound unique index
    await collection.createIndex({ name: 1, maker_id: 1 }, { unique: true });
    console.log('✅ Created new compound unique index on (name, maker_id)');

    // Verify
    const newIndexes = await collection.getIndexes();
    console.log('📋 Updated indexes:', Object.keys(newIndexes));

    console.log('\n✅ Index migration complete! You can now create the same dish name for different makers.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error.message);
    process.exit(1);
  }
}

fixDishIndexes();
