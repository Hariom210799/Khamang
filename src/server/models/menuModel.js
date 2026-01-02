const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  maker_id: {
    type: mongoose.ObjectId,
    required: [true, 'Menu must have a maker'],
  },
  categories: {
    type: Array,
    default: [],
  },
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
