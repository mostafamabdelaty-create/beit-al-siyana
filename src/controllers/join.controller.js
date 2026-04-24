const JoinRequest = require('../models/JoinRequest.model');
const User = require('../models/User.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');
const bcrypt = require('bcryptjs');

// @POST /api/join
exports.submitJoinRequest = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.paymentScreenshot = req.file.path;
    }

    // Fix 1: whatsapp is required — use phone as fallback if not sent
    if (!data.whatsapp && data.phone) {
      data.whatsapp = data.phone;
    }

    // Fix 2: package field expects enum ('starter','professional','premium')
    // But the form sends the Plan ObjectId in the 'package' field.
    // Resolve the themeKey from the Plan model and use it as 'package'.
    const Plan = require('../models/Plan.model');
    const planId = data.package || data.selectedPlanId;
    if (planId && planId.match(/^[0-9a-fA-F]{24}$/)) {
      // It's a MongoDB ObjectId — look up the plan's themeKey
      const plan = await Plan.findById(planId);
      if (plan) {
        data.selectedPlanId = plan._id;
        // Map themeKey to valid enum; default to 'starter' if unknown
        const validEnums = ['starter', 'professional', 'premium'];
        data.package = validEnums.includes(plan.themeKey) ? plan.themeKey : 'starter';
      } else {
        data.package = 'starter';
      }
    } else if (!data.package) {
      data.package = 'starter';
    }

    const request = await JoinRequest.create(data);
    res.status(201).json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سيتم مراجعته قريباً.',
      data: request
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/join-requests/:id/approve
exports.approveJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    if (request.status !== 'pending') return res.status(400).json({ success: false, message: 'لقد تم معالجة هذا الطلب مسبقاً' });

    // 1. Find Plan ID based on package string
    let planId = request.selectedPlanId;
    const Plan = require('../models/Plan.model');
    if (!planId && request.package) {
      const plan = await Plan.findOne({ themeKey: request.package });
      if (plan) planId = plan._id;
    }

    let startDate = new Date();
    let expiryDate = new Date();
    expiryDate.setMonth(startDate.getMonth() + 1);

    if (request.type === 'renew') {
      // HANDLE RENEWAL
      const user = await User.findOne({ email: request.email });
      if (!user) return res.status(404).json({ success: false, message: 'المستخدم غير موجود للتجديد' });

      // Get current profile to check existing expiry
      const profile = await TechnicianProfile.findOne({ userId: user._id });
      if (profile && profile.subscriptionExpiry) {
        const currentExpiry = new Date(profile.subscriptionExpiry);
        const now = new Date();
        
        if (currentExpiry > now) {
          // Cumulative: add 1 month to current expiry
          startDate = currentExpiry;
          expiryDate = new Date(currentExpiry);
          expiryDate.setMonth(startDate.getMonth() + 1);
        }
      }

      await TechnicianProfile.findOneAndUpdate(
        { userId: user._id },
        { 
          currentPlanId: planId,
          subscriptionStartDate: startDate,
          subscriptionExpiry: expiryDate
        }
      );
    } else {
      // HANDLE NEW JOIN
      // 1. Create User
      const user = await User.create({
        fullName: request.fullName,
        email: request.email,
        phone: request.phone,
        password: request.password,
        role: 'technician',
        status: 'active',
        mustChangePassword: false
      });

      // 2. Create Technician Profile
      await TechnicianProfile.create({
        userId: user._id,
        specialty: request.specialty,
        yearsOfExperience: request.yearsOfExperience,
        bio: request.bio,
        city: request.city,
        address: request.address,
        whatsapp: request.whatsapp,
        profileImage: request.profileImage,
        galleryImages: request.workImages,
        currentPlanId: planId,
        subscriptionStartDate: startDate,
        subscriptionExpiry: expiryDate
      });
    }

    // 3. Update Request Status
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    await request.save();

    res.json({
      success: true,
      message: request.type === 'renew' ? 'تم تجديد الاشتراك بنجاح' : 'تم قبول الطلب وإضافة الفني بنجاح'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/admin/join-requests/:id/reject
exports.rejectJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    
    request.status = 'rejected';
    request.rejectedAt = Date.now();
    request.adminNotes = req.body.adminNotes;
    await request.save();

    res.json({ success: true, message: 'تم رفض الطلب' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/admin/join-requests
exports.getAllJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
