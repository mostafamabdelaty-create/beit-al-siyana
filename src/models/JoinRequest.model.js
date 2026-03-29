const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    specialty: { type: String, required: true },
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
    adminNotes: { type: String },
    temporaryPassword: { type: String },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
