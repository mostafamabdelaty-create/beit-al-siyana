exports.mustChangePassword = (req, res, next) => {
  if (req.user && req.user.role === 'technician' && req.user.mustChangePassword) {
    return res.status(403).json({
      success: false,
      mustChangePassword: true,
      message: 'يجب تغيير كلمة المرور قبل المتابعة',
    });
  }
  next();
};
