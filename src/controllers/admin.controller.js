const User = require('../models/User.model');
const ServiceRequest = require('../models/ServiceRequest.model');
const JoinRequest = require('../models/JoinRequest.model');
const Service = require('../models/Service.model');
const Plan = require('../models/Plan.model');

// @GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalTechnicians = await User.countDocuments({ role: 'technician' });
    const totalBookings = await ServiceRequest.countDocuments();
    const pendingJoinRequests = await JoinRequest.countDocuments({ status: 'pending' });
    const totalServices = await Service.countDocuments();
    const totalPlans = await Plan.countDocuments();

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalTechnicians,
        totalBookings,
        pendingJoinRequests,
        totalServices,
        totalPlans
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/technicians
exports.getAllTechnicians = async (req, res) => {
  try {
    const techs = await User.find({ role: 'technician' }).select('-password');
    res.json({ success: true, data: techs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/users/:id/suspend
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'suspended' }, { new: true });
    res.json({ success: true, message: 'تم إيقاف الحساب بنجاح', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/users/:id/activate
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    res.json({ success: true, message: 'تم تفعيل الحساب بنجاح', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
