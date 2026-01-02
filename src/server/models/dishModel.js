const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A dish must have a name.'],
  },
  cuisine_type: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'A dish must have a price.'],
  },
  available: {
    type: Boolean,
    required: [true, 'A dish must show availablity.'],
  },
  category_name: {
    type: String,
    required: [true, 'A dish must have a category.'],
  },
  maker_id: {
    type: mongoose.ObjectId,
    required: [true, 'A dish must have a maker.'],
  },
  image: {
    type: String,
    default: null,
  },
});

// Compound unique index: same maker cannot have two dishes with same name
dishSchema.index({ name: 1, maker_id: 1 }, { unique: true });

const Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;
