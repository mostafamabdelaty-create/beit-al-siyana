const Package = require('../models/Package.model');

// @GET /api/packages
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/packages (Admin)
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, message: 'تم إضافة الباقة', data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/packages/:id (Admin)
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'الباقة مش موجودة' });
    res.json({ success: true, message: 'تم التعديل', data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/packages/:id (Admin)
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'الباقة مش موجودة' });
    res.json({ success: true, message: 'تم حذف الباقة' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
