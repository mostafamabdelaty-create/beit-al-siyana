const JoinRequest = require('../models/JoinRequest.model');
const User = require('../models/User.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');
const bcrypt = require('bcryptjs');

// @POST /api/join
exports.submitJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.create(req.body);
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

    // 1. Create User
    const tempPassword = request.temporaryPassword || 'Sallahly123456';
    const user = await User.create({
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      password: tempPassword,
      role: 'technician',
      status: 'active',
      mustChangePassword: true
    });

    // 2. Create Technician Profile
    await TechnicianProfile.create({
      userId: user._id,
      specialty: request.specialty,
      yearsOfExperience: request.yearsOfExperience,
      bio: request.bio,
      city: request.city,
      whatsapp: request.whatsapp,
      profileImage: request.profileImage,
      galleryImages: request.workImages,
      currentPlanId: request.selectedPlanId
    });

    // 3. Update Request
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = Date.now();
    await request.save();

    res.json({
      success: true,
      message: 'تم قبول الطلب وإضافة الفني بنجاح',
      data: { userId: user._id, tempPassword }
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
