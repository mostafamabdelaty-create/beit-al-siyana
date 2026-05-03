const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    specialty: { type: String, required: true },
    customSpecialty: { type: String },
    yearsOfExperience: { type: Number, required: true },
    bio: { type: String, required: true },
    whatsapp: { type: String, required: true },
    profileImage: { type: String },
    workImages: [{ type: String }],
    selectedPlanId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Plan' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    package: { 
      type: String, 
      enum: ['starter', 'professional', 'premium'], 
      required: true 
    },
    type: {
      type: String,
      enum: ['join', 'renew'],
      default: 'join'
    },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 1 },
    durationUnit: { type: String, default: 'months' },
    paymentScreenshot: { type: String },
    password: { type: String, required: true },
    adminNotes: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
