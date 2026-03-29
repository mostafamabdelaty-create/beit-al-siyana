const User = require('../models/User.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');

// @GET /api/technicians
exports.getTechnicians = async (req, res) => {
  try {
    const techs = await User.find({ role: 'technician', status: 'active' }).select('-password');
    res.json({ success: true, data: techs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/technicians/service/:serviceName
exports.getTechniciansByService = async (req, res) => {
  try {
    const term = req.params.serviceName;
    const profiles = await TechnicianProfile.find({ 
      specialty: { $regex: term, $options: 'i' } 
    }).populate('userId', 'fullName email phone status role');
    
    // Flatten and filter out inactive users
    const activeTechs = profiles
      .filter(p => p.userId && p.userId.status === 'active')
      .map(p => ({
        id: p.userId._id,
        name: p.userId.fullName,
        photo: p.profileImage,
        services: p.specialty.split('،').map(s => s.trim()),
        experience: p.yearsOfExperience,
        location: p.city,
        rating: p.ratingAverage,
        reviewsCount: p.reviewsCount,
        isTrusted: p.isTrusted
      }));
    
    res.json({ success: true, data: activeTechs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/technicians/:id
exports.getTechnicianById = async (req, res) => {
  try {
    const profile = await TechnicianProfile.findOne({ userId: req.params.id })
      .populate('userId', 'fullName email phone status role');
    
    if (!profile) return res.status(404).json({ success: false, message: 'الفني غير موجود' });
    
    const data = {
      id: profile.userId._id,
      name: profile.userId.fullName,
      email: profile.userId.email,
      phone: profile.userId.phone,
      photo: profile.profileImage,
      services: profile.specialty.split('،').map(s => s.trim()),
      experience: profile.yearsOfExperience,
      location: profile.city,
      bio: profile.bio,
      whatsapp: profile.whatsapp,
      gallery: profile.galleryImages,
      rating: profile.ratingAverage,
      reviewsCount: profile.reviewsCount,
      isTrusted: profile.isTrusted
    };
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/technicians/profile (Technician Only)
exports.updateProfile = async (req, res) => {
  try {
    const profile = await TechnicianProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/technicians/gallery (Technician Only)
exports.addToGallery = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const profile = await TechnicianProfile.findOne({ userId: req.user._id });
    profile.galleryImages.push(imageUrl);
    await profile.save();
    res.json({ success: true, data: profile.galleryImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/technicians/gallery/:index (Technician Only)
exports.removeFromGallery = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const profile = await TechnicianProfile.findOne({ userId: req.user._id });
    profile.galleryImages.splice(index, 1);
    await profile.save();
    res.json({ success: true, data: profile.galleryImages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
