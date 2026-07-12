const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  getReservationsByDate,
  updateReservation,
  cancelReservation
} = require('../controllers/reservationController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createReservation)
  .get(protect, getReservations);

router.get('/date', protect, admin, getReservationsByDate);
router.put('/:id', protect, admin, updateReservation);
router.delete('/:id', protect, cancelReservation);

module.exports = router;