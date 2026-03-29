const Plan = require('../models/Plan.model');

// @GET /api/packages
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true });
    const data = plans.map(p => ({
      id: p._id,
      name: p.name,
      price: p.price,
      period: p.billingPeriod,
      features: p.features,
      popular: p.isPopular,
      description: p.description
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/packages (Admin Only)
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/packages/:id (Admin Only)
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/packages/:id (Admin Only)
exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم حذف الباقة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
