const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  seedTables
} = require('../controllers/tableController');
const { protect, admin } = require('../middleware/auth');

// Make GET tables public (no authentication required)
router.get('/', getTables);

// All other routes require admin
router.post('/', protect, admin, createTable);
router.put('/:id', protect, admin, updateTable);
router.delete('/:id', protect, admin, deleteTable);
router.post('/seed', protect, admin, seedTables);

module.exports = router;