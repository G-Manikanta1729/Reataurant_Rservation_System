const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public (changed from Admin only)
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create table
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;

    // Check if table already exists
    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const table = await Table.create({ tableNumber, capacity });
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
exports.updateTable = async (req, res) => {
  try {
    const { capacity, isAvailable } = req.body;

    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (capacity) table.capacity = capacity;
    if (isAvailable !== undefined) table.isAvailable = isAvailable;

    await table.save();
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    await table.deleteOne();
    res.json({ message: 'Table removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed tables (for initial setup)
// @route   POST /api/tables/seed
// @access  Private/Admin
exports.seedTables = async (req, res) => {
  try {
    // Clear existing tables
    await Table.deleteMany({});

    const tables = [
      { tableNumber: 1, capacity: 2 },
      { tableNumber: 2, capacity: 2 },
      { tableNumber: 3, capacity: 4 },
      { tableNumber: 4, capacity: 4 },
      { tableNumber: 5, capacity: 4 },
      { tableNumber: 6, capacity: 6 },
      { tableNumber: 7, capacity: 6 },
      { tableNumber: 8, capacity: 8 }
    ];

    await Table.insertMany(tables);
    res.json({ message: 'Tables seeded successfully', count: tables.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};