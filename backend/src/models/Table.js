const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, 'Table number is required'],
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Table', TableSchema);