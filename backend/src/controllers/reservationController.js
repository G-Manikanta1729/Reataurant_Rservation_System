const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Helper function to check availability
const checkAvailability = async (tableId, date, timeSlot, guests, excludeReservationId = null) => {
  // Parse time
  const [hours, minutes] = timeSlot.split(':').map(Number);
  
  // Create start and end time for the reservation (2-hour slots)
  const startTime = new Date(date);
  startTime.setHours(hours, minutes, 0, 0);

    // VALIDATE TIME SLOT - ADD THIS
  const validTimeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
  if (!validTimeSlots.includes(timeSlot)) {
    throw new Error('Invalid time slot. Please select a valid time (10:00 - 21:00)');
  }
  
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 2, 0, 0, 0);

  // Check if table exists and has capacity
  const table = await Table.findById(tableId);
  if (!table) {
    throw new Error('Table not found');
  }

  if (guests > table.capacity) {
    throw new Error(`Table capacity is ${table.capacity} guests`);
  }

  // Check for overlapping reservations
  const query = {
    table: tableId,
    status: 'confirmed'
  };

  // If updating, exclude the current reservation
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }

  const existingReservations = await Reservation.find(query);

  for (const reservation of existingReservations) {
    const resStart = new Date(reservation.date);
    const [h, m] = reservation.timeSlot.split(':').map(Number);
    resStart.setHours(h, m, 0, 0);
    
    const resEnd = new Date(resStart);
    resEnd.setHours(resStart.getHours() + 2, 0, 0, 0);

    // Check if time slots overlap
    if ((startTime < resEnd && endTime > resStart)) {
      throw new Error('This table is already booked for the requested time slot');
    }
  }

  return true;
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests } = req.body;

    // Validate date is in the future
    const reservationDate = new Date(date);
    const now = new Date();
    if (reservationDate < now) {
      return res.status(400).json({ message: 'Reservation date must be in the future' });
    }

    // Check availability
    await checkAvailability(tableId, date, timeSlot, guests);

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user.id,
      table: tableId,
      date,
      timeSlot,
      guests
    });

    // Populate user and table details
    await reservation.populate('user', 'name email');
    await reservation.populate('table', 'tableNumber capacity');

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all reservations (Admin) or user's reservations (Customer)
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    let query = {};

    // If user is not admin, only show their reservations
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ date: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reservations by date (Admin only)
// @route   GET /api/reservations/date
// @access  Private/Admin
exports.getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Create date range for the entire day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
      date: { $gte: startDate, $lte: endDate },
      status: 'confirmed'
    })
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ timeSlot: 1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update reservation (Admin only)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
exports.updateReservation = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests, status } = req.body;

    // Find reservation
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check availability if table, date, time, or guests changed
    if (tableId || date || timeSlot || guests) {
      const newTableId = tableId || reservation.table;
      const newDate = date || reservation.date;
      const newTimeSlot = timeSlot || reservation.timeSlot;
      const newGuests = guests || reservation.guests;

      await checkAvailability(newTableId, newDate, newTimeSlot, newGuests, req.params.id);

      reservation.table = newTableId;
      reservation.date = newDate;
      reservation.timeSlot = newTimeSlot;
      reservation.guests = newGuests;
    }

    if (status) {
      reservation.status = status;
    }

    await reservation.save();
    await reservation.populate('user', 'name email');
    await reservation.populate('table', 'tableNumber capacity');

    res.json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel reservation (Customer cancels own, Admin cancels any)
// @route   DELETE /api/reservations/:id
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns the reservation or is admin
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ message: 'Reservation already cancelled' });
    }

    // Update status to cancelled instead of deleting
    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};