const mongoose = require('mongoose');

// 流行病学调查模型Schema
const surveySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedingBatch' },
  farmName: { type: String, required: true },
  location: {
    province: String,
    city: String,
    district: String,
    address: String
  },
  // 7步流调数据
  surveyDate: { type: Date, required: true },
  investigator: { type: String },
  // Step 1: 禽群基本情况
  species: String,
  breed: String,
  ageDays: Number,
  flockSize: { type: Number, required: true },
  // Step 2: 发病情况
  onsetDate: Date,
  affectedCount: Number,
  deadCount: Number,
  culledCount: Number,
  morbidityRate: Number,
  mortalityRate: Number,
  // Step 3: 临床症状
  clinicalSymptoms: [{ type: String }],
  symptomsDescription: String,
  // Step 4: 病理变化
  pathologyFindings: [{ type: String }],
  pathologyDescription: String,
  // Step 5: 免疫情况
  vaccinationHistory: [{
    vaccineName: String,
    vaccineType: String,
    immunizationDate: Date,
    dose: String
  }],
  // Step 6: 环境因素
  environmentNotes: String,
  temperature: Number,
  humidity: Number,
  ventilation: String,
  // Step 7: 初步结论
  preliminaryDiagnosis: String,
  suspectedDiseases: [{ type: String }],
  suggestions: String,
  // 草稿管理
  isDraft: { type: Boolean, default: false },
  draftSavedAt: Date,
  // 图片
  imageUrls: [{ type: String }]
}, {
  timestamps: true
});

// 索引
surveySchema.index({ userId: 1, surveyDate: -1 });
surveySchema.index({ farmName: 1, surveyDate: -1 });
surveySchema.index({ isDraft: 1, userId: 1 });
surveySchema.index({ 'location.province': 1, 'location.city': 1 });

module.exports = mongoose.model('EpidemiologicalSurvey', surveySchema);
