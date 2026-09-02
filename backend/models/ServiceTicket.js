const mongoose = require('mongoose');

const serviceTicketSchema = new mongoose.Schema({
  ticketNo: { type: String, required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['diagnosis_help', 'treatment_guidance', 'farm_visit', 'training', 'consultation', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  relatedBatchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedingBatch' },
  relatedDiagnosisId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosisRecord' },
  location: { type: String },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  images: [{ type: String }],
  messages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String },
    imageUrls: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  rating: {
    score: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, {
  timestamps: true
});

// 索引
serviceTicketSchema.index({ ticketNo: 1 }, { unique: true });
serviceTicketSchema.index({ requesterId: 1, status: 1, createdAt: -1 });
serviceTicketSchema.index({ assigneeId: 1, status: 1, createdAt: -1 });
serviceTicketSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('ServiceTicket', serviceTicketSchema);
