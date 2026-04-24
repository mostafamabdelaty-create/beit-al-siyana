const mongoose = require('mongoose');

const customerProfileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    address: { type: String },
    city: { type: String },
    profileImage: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomerProfile', customerProfileSchema);
