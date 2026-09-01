const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlPlan', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedingBatch' },
  followUpType: { type: String, enum: ['day3', 'day7', 'custom'], required: true },
  scheduledDate: { type: Date, required: true },
  completedDate: { type: Date },
  status: { type: String, enum: ['pending', 'completed', 'overdue', 'cancelled'], default: 'pending' },
  questions: {
    mortalityChange: String,
    symptomImprovement: String,
    medicationCompliance: String,
    sideEffects: String,
    feedIntakeChange: String,
    additionalSymptoms: String,
    overallAssessment: String
  },
  aiAssessment: {
    effectiveness: String,
    recommendation: String,
    needAdjustment: Boolean,
    nextFollowUpDate: Date
  },
  notes: String,
  completedBy: { type: String, enum: ['user', 'system', 'vet'] }
}, { timestamps: true });

followUpSchema.index({ userId: 1, scheduledDate: -1 });
followUpSchema.index({ planId: 1, followUpType: 1 });
followUpSchema.index({ status: 1, scheduledDate: -1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
