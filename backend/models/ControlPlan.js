const mongoose = require('mongoose');

const controlPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedingBatch' },
  triggerDiagnosisId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosisRecord' },
  planName: { type: String, required: true },
  planType: { type: String, enum: ['emergency', 'routine', 'followup'], default: 'emergency' },
  diseaseName: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  planContent: {
    overview: { type: String },
    isolation: { type: String },
    disinfection: { type: String },
    medication: {
      recommendations: [{ drugName: String, dosage: String, duration: String, note: String }],
      greenDrugs: [String]
    },
    vaccination: { type: String },
    monitoring: { type: String },
    emergency: { type: String },
    timeline: [{ day: Number, action: String, responsible: String }]
  },
  status: { type: String, enum: ['draft', 'active', 'completed', 'archived'], default: 'active' },
  generatedBy: { type: String, enum: ['ai', 'manual'], default: 'ai' },
  completionNotes: { type: String },
  completedAt: { type: Date }
}, { timestamps: true });

controlPlanSchema.index({ userId: 1, createdAt: -1 });
controlPlanSchema.index({ batchId: 1, createdAt: -1 });
controlPlanSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ControlPlan', controlPlanSchema);
