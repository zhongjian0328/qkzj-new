const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceTicket' },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: {
    type: String,
    enum: ['diagnosis', 'treatment', 'training', 'consultation', 'farm_visit']
  },
  content: { type: String, required: true },
  images: [{ type: String }],
  outcome: { type: String },
  followUpNeeded: { type: Boolean, default: false }
}, {
  timestamps: true
});

// 索引
serviceRecordSchema.index({ providerId: 1, createdAt: -1 });
serviceRecordSchema.index({ clientId: 1, createdAt: -1 });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
