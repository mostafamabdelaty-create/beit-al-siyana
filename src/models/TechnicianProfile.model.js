const mongoose = require('mongoose');

const technicianProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    specialty: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: false },
    whatsapp: { type: String, required: true },
    profileImage: { type: String },
    galleryImages: [{ type: String }],
    galleryVideos: [{ type: String }],
    ratingAverage: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isTrusted: { type: Boolean, default: false },
    currentPlanId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Plan' 
    },
    subscriptionStartDate: { type: Date },
    subscriptionExpiry: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TechnicianProfile', technicianProfileSchema);
