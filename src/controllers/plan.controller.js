const Plan = require('../models/Plan.model');

const toBool = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  return defaultValue;
};

const parseFeatures = (features) => {
  if (Array.isArray(features)) {
    return features.map((f) => String(f).trim()).filter(Boolean);
  }

  if (typeof features === 'string') {
    return features
      .split('\n')
      .flatMap((line) => line.split(','))
      .map((f) => f.trim())
      .filter(Boolean);
  }

  return [];
};

const formatPlan = (planDoc) => ({
  id: planDoc._id,
  name: planDoc.name,
  price: planDoc.price,
  period: planDoc.billingPeriod,
  pricingOptions: planDoc.pricingOptions || [],
  features: planDoc.features || [],
  popular: !!planDoc.isPopular,
  description: planDoc.description || '',
  isActive: !!planDoc.isActive,
  sortPriority: planDoc.sortPriority || 0,
  themeKey: planDoc.themeKey || 'starter',
  badgeText: planDoc.badgeText || '',
  limits: {
    maxImages: planDoc.limits?.maxImages || 0,
    maxVideos: planDoc.limits?.maxVideos || 0
  },
  benefits: {
    platformVisibility: !!planDoc.benefits?.platformVisibility,
    contactInfo: !!planDoc.benefits?.contactInfo,
    workImages: !!planDoc.benefits?.workImages,
    topInListing: !!planDoc.benefits?.topInListing,
    trustedBadge: !!planDoc.benefits?.trustedBadge,
    topInProfile: !!planDoc.benefits?.topInProfile,
    workVideos: !!planDoc.benefits?.workVideos
  },
  style: {
    accentColor: planDoc.style?.accentColor || '',
    gradientFrom: planDoc.style?.gradientFrom || '',
    gradientTo: planDoc.style?.gradientTo || '',
    isGradient: !!planDoc.style?.isGradient
  }
});

const buildPlanPayload = (body = {}, isUpdate = false) => {
  const payload = {};

  if (!isUpdate || body.name !== undefined) payload.name = String(body.name || '').trim();
  if (!isUpdate || body.price !== undefined) payload.price = Number(body.price || 0);
  if (!isUpdate || body.billingPeriod !== undefined || body.period !== undefined) {
    payload.billingPeriod = body.billingPeriod || body.period || 'monthly';
  }
  if (!isUpdate || body.description !== undefined) payload.description = String(body.description || '').trim();
  if (!isUpdate || body.features !== undefined) payload.features = parseFeatures(body.features);
  if (!isUpdate || body.isPopular !== undefined || body.popular !== undefined) {
    payload.isPopular = toBool(body.isPopular ?? body.popular, false);
  }
  if (!isUpdate || body.isActive !== undefined) payload.isActive = toBool(body.isActive, true);
  if (!isUpdate || body.sortPriority !== undefined) payload.sortPriority = Number(body.sortPriority || 0);
  if (!isUpdate || body.themeKey !== undefined) payload.themeKey = body.themeKey || 'starter';
  if (!isUpdate || body.badgeText !== undefined) payload.badgeText = String(body.badgeText || '').trim();

  // Pricing Options parsing
  if (!isUpdate || body.pricingOptions !== undefined) {
    if (Array.isArray(body.pricingOptions)) {
      payload.pricingOptions = body.pricingOptions.map(opt => ({
        duration: Number(opt.duration || 0),
        unit: opt.unit || 'months',
        price: Number(opt.price || 0),
        label: String(opt.label || '').trim()
      }));
    } else if (typeof body.pricingOptions === 'string') {
      try {
        payload.pricingOptions = JSON.parse(body.pricingOptions);
      } catch (e) {
        payload.pricingOptions = [];
      }
    }
  }

  // Limits
  if (!isUpdate || body.limits !== undefined || body.maxImages !== undefined || body.maxVideos !== undefined) {
    const lim = body.limits || {};
    payload.limits = {
      maxImages: Number(lim.maxImages ?? body.maxImages ?? 0),
      maxVideos: Number(lim.maxVideos ?? body.maxVideos ?? 0)
    };
  }

  const incomingBenefits = body.benefits || {};
  const incomingStyle = body.style || {};

  if (
    !isUpdate ||
    body.benefits !== undefined ||
    body.platformVisibility !== undefined ||
    body.contactInfo !== undefined ||
    body.workImages !== undefined ||
    body.topInListing !== undefined ||
    body.trustedBadge !== undefined ||
    body.topInProfile !== undefined ||
    body.workVideos !== undefined
  ) {
    payload.benefits = {
      platformVisibility: toBool(incomingBenefits.platformVisibility ?? body.platformVisibility, true),
      contactInfo: toBool(incomingBenefits.contactInfo ?? body.contactInfo, true),
      workImages: toBool(incomingBenefits.workImages ?? body.workImages, false),
      topInListing: toBool(incomingBenefits.topInListing ?? body.topInListing, false),
      trustedBadge: toBool(incomingBenefits.trustedBadge ?? body.trustedBadge, false),
      topInProfile: toBool(incomingBenefits.topInProfile ?? body.topInProfile, false),
      workVideos: toBool(incomingBenefits.workVideos ?? body.workVideos, false)
    };
  }

  if (
    !isUpdate ||
    body.style !== undefined ||
    body.accentColor !== undefined ||
    body.gradientFrom !== undefined ||
    body.gradientTo !== undefined ||
    body.isGradient !== undefined
  ) {
    payload.style = {
      accentColor: String(incomingStyle.accentColor ?? body.accentColor ?? '').trim() || '#2563eb',
      gradientFrom: String(incomingStyle.gradientFrom ?? body.gradientFrom ?? '').trim(),
      gradientTo: String(incomingStyle.gradientTo ?? body.gradientTo ?? '').trim(),
      isGradient: toBool(incomingStyle.isGradient ?? body.isGradient, false)
    };
  }

  return payload;
};

// @GET /api/packages
exports.getPlans = async (req, res) => {
  try {
    const query = req.query.includeInactive === '1' ? {} : { isActive: true };
    const plans = await Plan.find(query).sort({ isActive: -1, sortPriority: -1, price: 1, createdAt: 1 });
    res.json({ success: true, data: plans.map(formatPlan) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/packages (Admin Only)
exports.createPlan = async (req, res) => {
  try {
    const payload = buildPlanPayload(req.body, false);

    if (!payload.name) {
      return res.status(400).json({ success: false, message: 'اسم الباقة مطلوب' });
    }
    if (!Number.isFinite(payload.price) || payload.price < 0) {
      return res.status(400).json({ success: false, message: 'سعر الباقة غير صحيح' });
    }

    const plan = await Plan.create(payload);
    res.status(201).json({ success: true, data: formatPlan(plan) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @PUT /api/packages/:id (Admin Only)
exports.updatePlan = async (req, res) => {
  try {
    const payload = buildPlanPayload(req.body, true);
    const plan = await Plan.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
    }

    res.json({ success: true, data: formatPlan(plan) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @DELETE /api/packages/:id (Admin Only)
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
    }
    res.json({ success: true, message: 'تم حذف الباقة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
