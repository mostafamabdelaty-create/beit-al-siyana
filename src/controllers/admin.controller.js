const User = require('../models/User.model');
const ServiceRequest = require('../models/ServiceRequest.model');
const JoinRequest = require('../models/JoinRequest.model');
const Service = require('../models/Service.model');
const Plan = require('../models/Plan.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');

const formatPlanSummary = (plan) => {
  if (!plan) return null;

  return {
    id: plan._id,
    name: plan.name,
    themeKey: plan.themeKey || 'starter',
    sortPriority: plan.sortPriority || 0
  };
};

const formatTechnicianWithPlan = (user, profile) => ({
  _id: user?._id,
  id: user?._id,
  fullName: user?.fullName || '',
  email: user?.email || '',
  phone: user?.phone || '',
  status: user?.status || 'active',
  createdAt: user?.createdAt,
  specialty: profile?.specialty || '',
  city: profile?.city || '',
  address: profile?.address || '',
  yearsOfExperience: profile?.yearsOfExperience || 0,
  subscriptionExpiry: profile?.subscriptionExpiry || null,
  subscriptionStartDate: profile?.subscriptionStartDate || null,
  currentPlan: formatPlanSummary(profile?.currentPlanId)
});

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

// @GET /api/admin/technicians-with-plans
exports.getTechniciansWithPlans = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' })
      .select('fullName email phone status role')
      .sort({ createdAt: -1 });

    if (technicians.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const profiles = await TechnicianProfile.find({ userId: { $in: technicians.map((t) => t._id) } })
      .populate('currentPlanId', 'name themeKey sortPriority');

    const profileByUserId = new Map(profiles.map((p) => [String(p.userId), p]));
    const enrichedTechnicians = technicians.map((tech) =>
      formatTechnicianWithPlan(tech, profileByUserId.get(String(tech._id)) || null)
    );

    res.json({ success: true, data: enrichedTechnicians });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/technicians/:id/plan
exports.assignPlanToTechnician = async (req, res) => {
  try {
    const technicianId = req.params.id;
    const { planId } = req.body || {};

    const technician = await User.findOne({ _id: technicianId, role: 'technician' })
      .select('fullName email phone status role');

    if (!technician) {
      return res.status(404).json({ success: false, message: 'الفني غير موجود' });
    }

    let plan = null;
    if (planId) {
      plan = await Plan.findById(planId);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
      }
    }

    let profile = await TechnicianProfile.findOne({ userId: technicianId });

    if (!profile) {
      profile = await TechnicianProfile.create({
        userId: technicianId,
        specialty: 'غير محدد',
        yearsOfExperience: 0,
        bio: 'لا يوجد وصف',
        city: 'غير محدد',
        whatsapp: technician.phone || 'غير متاح',
        currentPlanId: plan ? plan._id : null
      });
    } else {
      profile.currentPlanId = plan ? plan._id : null;
      await profile.save();
    }

    const populatedProfile = await TechnicianProfile.findById(profile._id)
      .populate('currentPlanId', 'name themeKey sortPriority');

    res.json({
      success: true,
      message: plan ? 'تم تحديث باقة الفني بنجاح' : 'تم إزالة باقة الفني بنجاح',
      data: formatTechnicianWithPlan(technician, populatedProfile)
    });
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
// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });

    if (user.role === 'technician') {
      await TechnicianProfile.findOneAndDelete({ userId: user._id });
    }
    
    await User.findByIdAndDelete(user._id);
    res.json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
