exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `الدور (${req.user.role}) غير مصرح له بالوصول لهذا المسار`,
      });
    }
    next();
  };
};
