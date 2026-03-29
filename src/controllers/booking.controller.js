const ServiceRequest = require('../models/ServiceRequest.model');

// @POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const booking = await ServiceRequest.create({
      ...req.body,
      customerId: req.user._id
    });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/my-requests
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await ServiceRequest.find({ customerId: req.user._id })
      .populate('serviceId', 'name')
      .populate('technicianId', 'fullName');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/bookings/:id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await ServiceRequest.findById(req.params.id)
      .populate('serviceId', 'name')
      .populate('technicianId', 'fullName')
      .populate('customerId', 'fullName email phone');
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Only
// @GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await ServiceRequest.find()
      .populate('serviceId', 'name')
      .populate('technicianId', 'fullName')
      .populate('customerId', 'fullName');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/bookings/:id
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
