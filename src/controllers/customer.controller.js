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
    const { fullName, phone, address, city, email, password } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    // Update Email if provided and different
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'هذا البريد الإلكتروني مستخدم بالفعل' });
      }
      user.email = email;
    }

    // Update Name and Phone
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    // Update Password if provided
    if (password && password.trim() !== '') {
      user.password = password; // Pre-save middleware will hash it
    }

    await user.save();
    
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

// @POST /api/customers/profile-image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'من فضلك ارفع صورة' });
    }

    const imagePath = req.file.path.replace(/\\/g, '/');
    
    const profile = await CustomerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { profileImage: imagePath },
      { new: true }
    );

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

