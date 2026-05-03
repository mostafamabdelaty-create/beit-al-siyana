const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    serviceId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Service', 
      required: true 
    },
    technicianId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    preferredDate: { type: Date },
    status: { 
      type: String, 
      enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
