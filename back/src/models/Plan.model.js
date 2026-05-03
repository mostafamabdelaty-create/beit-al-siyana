const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // New Flexible Pricing Options
    pricingOptions: [{
      duration: { type: Number, required: true }, // e.g. 5, 1, 3
      unit: { type: String, enum: ['days', 'months', 'years'], required: true },
      price: { type: Number, required: true },
      label: { type: String } // e.g. "5 أيام", "شهري"
    }],
    // Current default price for backward compatibility and quick display
    price: { type: Number, required: true },
    billingPeriod: { type: String, default: 'monthly' },
    
    description: { type: String },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    
    // Limits
    limits: {
      maxImages: { type: Number, default: 0 },
      maxVideos: { type: Number, default: 0 }
    },

    // Controls plan ordering in technicians listing (higher = more visible)
    sortPriority: { type: Number, default: 0 },
    // Used by public UI to style technician profile/cards by plan tier
    themeKey: {
      type: String,
      enum: ['starter', 'professional', 'premium', 'custom'],
      default: 'starter'
    },
    badgeText: { type: String, trim: true, default: '' },
    benefits: {
      platformVisibility: { type: Boolean, default: true },
      contactInfo: { type: Boolean, default: true },
      workImages: { type: Boolean, default: false },
      topInListing: { type: Boolean, default: false },
      workVideos: { type: Boolean, default: false },
      trustedBadge: { type: Boolean, default: false },
      topInProfile: { type: Boolean, default: false }
    },
    style: {
      accentColor: { type: String, default: '#2563eb' },
      gradientFrom: { type: String, default: '' },
      gradientTo: { type: String, default: '' },
      isGradient: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
