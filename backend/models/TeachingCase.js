const mongoose = require('mongoose');

const teachingCaseSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceTicket' },
  diagnosisId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosisRecord' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  diseaseType: { type: String },
  caseImages: [{ type: String }],
  keyFindings: { type: String },
  treatmentProcess: { type: String },
  outcome: { type: String },
  lessonsLearned: { type: String },
  tags: [{ type: String }],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'approved', 'rejected'],
    default: 'draft'
  },
  mentorComment: { type: String },
  views: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 索引
teachingCaseSchema.index({ authorId: 1, status: 1, createdAt: -1 });
teachingCaseSchema.index({ diseaseType: 1, status: 1 });
teachingCaseSchema.index({ mentorId: 1, status: 1 });

module.exports = mongoose.model('TeachingCase', teachingCaseSchema);
