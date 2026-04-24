const User = require('../models/User.model');
const TechnicianProfile = require('../models/TechnicianProfile.model');
const Plan = require('../models/Plan.model');

const checkAndDowngradeIfExpired = async (profile) => {
  if (!profile || !profile.subscriptionExpiry || !profile.currentPlanId) return profile;

  // currentPlanId might be populated or not
  const planKey = profile.currentPlanId.themeKey || (profile.currentPlanId.themeKey === undefined ? null : profile.currentPlanId.themeKey);
  
  // If we can't see the themeKey, we might need to populate it if it's just an ID
  let currentTheme = planKey;
  if (!currentTheme && typeof profile.currentPlanId === 'object' && profile.currentPlanId._id) {
     // it is populated but themeKey is missing? unlikely if normalizePlan works
  }

  // If plan is already starter, ignore
  if (currentTheme === 'starter') return profile;

  const now = new Date();
  const expiry = new Date(profile.subscriptionExpiry);

  if (now > expiry) {
    // Expired! Downgrade to Starter
    const starterPlan = await Plan.findOne({ themeKey: 'starter' });
    if (starterPlan && String(profile.currentPlanId._id || profile.currentPlanId) !== String(starterPlan._id)) {
      profile.currentPlanId = starterPlan._id;
      // We don't change expiry for starter, it stays as is but the plan rank drops
      await profile.save();
      await profile.populate('currentPlanId');
    }
  }
  return profile;
};


const splitServices = (specialty = '') =>
  String(specialty)
    .split(/[،,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const getThemeDefaults = (themeKey) => {
  const themes = {
    starter: {
      accentColor: '#3b82f6',
      gradientFrom: '#eff6ff',
      gradientTo: '#dbeafe'
    },
    professional: {
      accentColor: '#2563eb',
      gradientFrom: '#dbeafe',
      gradientTo: '#bfdbfe'
    },
    premium: {
      accentColor: '#7c3aed',
      gradientFrom: '#f3e8ff',
      gradientTo: '#e9d5ff'
    },
    custom: {
      accentColor: '#0f766e',
      gradientFrom: '#ccfbf1',
      gradientTo: '#99f6e4'
    }
  };

  return themes[themeKey] || themes.starter;
};

const normalizePlan = (planDoc) => {
  if (!planDoc) return null;

  const themeKey = planDoc.themeKey || 'starter';
  const defaults = getThemeDefaults(themeKey);

  return {
    id: planDoc._id,
    name: planDoc.name,
    price: planDoc.price,
    period: planDoc.billingPeriod,
    description: planDoc.description || '',
    features: planDoc.features || [],
    sortPriority: planDoc.sortPriority || 0,
    themeKey,
    badgeText: planDoc.badgeText || planDoc.name,
    benefits: {
      platformVisibility: !!planDoc.benefits?.platformVisibility,
      contactInfo: !!planDoc.benefits?.contactInfo,
      workImages: !!planDoc.benefits?.workImages,
      workVideos: !!planDoc.benefits?.workVideos,
      topInListing: !!planDoc.benefits?.topInListing,
      trustedBadge: !!planDoc.benefits?.trustedBadge,
      topInProfile: !!planDoc.benefits?.topInProfile
    },
    style: {
      accentColor: planDoc.style?.accentColor || defaults.accentColor,
      gradientFrom: planDoc.style?.gradientFrom || defaults.gradientFrom,
      gradientTo: planDoc.style?.gradientTo || defaults.gradientTo
    }
  };
};

const toTechnicianCard = (profile) => {
  const plan = normalizePlan(profile.currentPlanId);
  const trustedByPlan = !!plan?.benefits?.trustedBadge;
  const topInListing = !!plan?.benefits?.topInListing;
  const planPriority = Number(plan?.sortPriority || 0);

  return {
    id: profile.userId._id,
    name: profile.userId.fullName,
    phone: profile.userId.phone,
    profileImage: profile.profileImage,
    services: splitServices(profile.specialty),
    experience: profile.yearsOfExperience,
    location: profile.city,
    bio: profile.bio,
    whatsapp: profile.whatsapp,
    rating: profile.ratingAverage,
    reviewsCount: profile.reviewsCount,
    isTrusted: profile.isTrusted || trustedByPlan,
    isPinned: topInListing,
    planRank: planPriority,
    plan
  };
};

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
    })
      .populate('userId', 'fullName email phone status role')
      .populate('currentPlanId');

    // Downgrade any expired techs in this list
    for (const p of profiles) {
      await checkAndDowngradeIfExpired(p);
    }

    const activeTechs = profiles
      .filter((p) => p.userId && p.userId.status === 'active')
      .map(toTechnicianCard)
      .sort((a, b) => {
        if (Number(b.isPinned) !== Number(a.isPinned)) return Number(b.isPinned) - Number(a.isPinned);
        if (b.planRank !== a.planRank) return b.planRank - a.planRank;
        return (b.rating || 0) - (a.rating || 0);
      });

    res.json({ success: true, data: activeTechs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/technicians/:id
exports.getTechnicianById = async (req, res) => {
  try {
    const profile = await TechnicianProfile.findOne({ userId: req.params.id })
      .populate('userId', 'fullName email phone status role')
      .populate('currentPlanId');

    if (!profile) return res.status(404).json({ success: false, message: 'الفني غير موجود' });

    // Downgrade if expired
    await checkAndDowngradeIfExpired(profile);

    const plan = normalizePlan(profile.currentPlanId);
    const trustedByPlan = !!plan?.benefits?.trustedBadge;

    const data = {
      id: profile.userId._id,
      name: profile.userId.fullName,
      email: profile.userId.email,
      phone: profile.userId.phone,
      profileImage: profile.profileImage,
      services: splitServices(profile.specialty),
      experience: profile.yearsOfExperience,
      location: profile.city,
      bio: profile.bio,
      whatsapp: profile.whatsapp,
      gallery: profile.galleryImages,
      videos: profile.galleryVideos,
      rating: profile.ratingAverage,
      reviewsCount: profile.reviewsCount,
      isTrusted: profile.isTrusted || trustedByPlan,
      plan
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/technicians/me (Technician Only)
exports.getMe = async (req, res) => {
  try {
    const profile = await TechnicianProfile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName email phone status role')
      .populate('currentPlanId');

    if (!profile) return res.status(404).json({ success: false, message: 'الملف غير موجود' });

    // Downgrade if expired
    await checkAndDowngradeIfExpired(profile);

    // Auto-Fix: Cap yearly/long subscriptions to 1 month from start
    if (profile.subscriptionExpiry && profile.subscriptionStartDate) {
      const start = new Date(profile.subscriptionStartDate);
      const expiry = new Date(profile.subscriptionExpiry);
      // If more than 31 days difference
      if ((expiry - start) > (31 * 24 * 60 * 60 * 1000)) {
        const newExpiry = new Date(start);
        newExpiry.setMonth(start.getMonth() + 1);
        profile.subscriptionExpiry = newExpiry;
        await profile.save();
      }
    }

    const plan = normalizePlan(profile.currentPlanId);
    
    const data = {
      user: {
        id: profile.userId?._id || req.user._id,
        fullName: profile.userId?.fullName || req.user.fullName || 'غير معروف',
        email: profile.userId?.email || req.user.email || '',
        phone: profile.userId?.phone || req.user.phone || '',
      },
      profile: {
        specialty: profile.specialty || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        bio: profile.bio || '',
        city: profile.city || '',
        address: profile.address || '',
        whatsapp: profile.whatsapp || '',
        profileImage: profile.profileImage || '',
        galleryImages: profile.galleryImages || [],
        galleryVideos: profile.galleryVideos || [],
        isTrusted: !!profile.isTrusted,
        subscriptionStartDate: profile.subscriptionStartDate,
        subscriptionExpiry: profile.subscriptionExpiry
      },
      plan
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('GetMe Error:', error);
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

// @POST /api/technicians/profile-image (Technician Only)
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'لم يتم رفع ملف' });
    
    const filePath = req.file.path.replace(/\\/g, '/');
    const profile = await TechnicianProfile.findOneAndUpdate(
      { userId: req.user._id },
      { profileImage: filePath },
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
    const { type } = req.body; // 'image' or 'video'
    if (!req.file) return res.status(400).json({ success: false, message: 'لم يتم رفع ملف' });
    
    const profile = await TechnicianProfile.findOne({ userId: req.user._id }).populate('currentPlanId');
    if (!profile) return res.status(404).json({ success: false, message: 'الملف غير موجود' });

    // Plan benefit checks
    const plan = profile.currentPlanId;
    const isProfessional = plan && plan.themeKey === 'professional';
    
    if (type === 'video') {
      const allowedByPlan = !!plan?.benefits?.workVideos;
      // Allow 1 video for professional plan even if workVideos is false
      if (!allowedByPlan && isProfessional) {
        if (profile.galleryVideos && profile.galleryVideos.length >= 1) {
          return res.status(403).json({ success: false, message: 'الباقة الاحترافية تسمح برفع فيديو واحد فقط' });
        }
      } else if (!allowedByPlan) {
        return res.status(403).json({ success: false, message: 'باقتك الحالية لا تدعم رفع الفيديوهات' });
      }
    }

    if (type === 'image' && (!plan || !plan.benefits?.workImages)) {
      return res.status(403).json({ success: false, message: 'باقتك الحالية لا تدعم رفع الصور' });
    }

    const filePath = req.file.path.replace(/\\/g, '/');

    if (type === 'video') {
      profile.galleryVideos.push(filePath);
    } else {
      profile.galleryImages.push(filePath);
    }

    await profile.save();
    res.json({ success: true, data: { filePath, type } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/technicians/gallery (Technician Only)
exports.removeFromGallery = async (req, res) => {
  try {
    const { filePath, type } = req.body;
    const profile = await TechnicianProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'الملف غير موجود' });

    if (type === 'video') {
      profile.galleryVideos = profile.galleryVideos.filter(v => v !== filePath);
    } else {
      profile.galleryImages = profile.galleryImages.filter(img => img !== filePath);
    }

    await profile.save();
    res.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
