const User = require('../models/User.model');
const CustomerProfile = require('../models/CustomerProfile.model');
const generateToken = require('../utils/generateToken');

// @POST /api/auth/register-customer
exports.registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, address, city } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل بالفعل' });
    }

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: 'customer'
    });

    // Create Customer Profile
    await CustomerProfile.create({
      userId: user._id,
      address,
      city
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'البريد أو كلمة المرور غير صحيحة' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'الحساب موقوف، تواصل مع الإدارة' });
    }

    const token = generateToken(user._id);

    // Special logic for technicians who must change password
    if (user.role === 'technician' && user.mustChangePassword) {
      return res.json({
        success: true,
        message: 'يجب تغيير كلمة المرور قبل المتابعة',
        mustChangePassword: true,
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          role: user.role
        }
      });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة غير متطابقة' });
    }

    const user = await User.findById(req.user.id);
    
    // Check current password
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
