const CustomerProfile = require('../models/CustomerProfile.model');
const User = require('../models/User.model');

// @GET /api/customers/profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email phone');
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/customers/profile
exports.updateCustomerProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city } = req.body;
    
    // Update User data
    await User.findByIdAndUpdate(req.user._id, { fullName, phone });
    
    // Update Profile data
    const profile = await CustomerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { address, city },
      { new: true }
    );
    
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
