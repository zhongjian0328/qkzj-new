const mongoose = require('mongoose');

// 知识图谱模型Schema — 承载42章禽病防治教材的结构化疾病知识
const knowledgeGraphSchema = new mongoose.Schema({
  diseaseName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // 疾病分类：病毒病/细菌病/其他微生物病/寄生虫病/普通病/总论
  category: {
    type: String,
    required: true,
    enum: ['viral', 'bacterial', 'other_microbial', 'parasitic', 'non_infectious', 'general'],
    default: 'viral'
  },
  // 章节号（对应教材章节）
  chapterNumber: {
    type: Number,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // 六段结构化内容
  pathogen: {
    type: String,
    default: ''
  },
  epidemiology: {
    type: String,
    default: ''
  },
  symptoms: {
    type: String,
    default: ''
  },
  pathologicalChanges: {
    type: String,
    default: ''
  },
  diagnosis: {
    type: String,
    default: ''
  },
  prevention: {
    type: String,
    default: ''
  },
  // 结构化标签
  symptomTags: {
    type: [String],
    default: []
  },
  lesionTags: {
    type: [String],
    default: []
  },
  // 免疫程序（结构化）
  immunizationSchedule: {
    type: String,
    default: ''
  },
  // 鉴别诊断
  differentialDiagnosis: {
    type: String,
    default: ''
  },
  // 用药要点
  medicationNotes: {
    type: String,
    default: ''
  },
  causes: {
    type: [String],
    default: []
  },
  preventionMethods: {
    type: [String],
    default: []
  },
  treatmentMethods: {
    type: [String],
    default: []
  },
  imageUrls: {
    type: [String],
    default: []
  },
  relatedDiseases: {
    type: [{ diseaseId: mongoose.Schema.Types.ObjectId, similarity: Number }],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  difficultyLevel: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    default: 'BEGINNER'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引
knowledgeGraphSchema.index({ tags: 1 });
knowledgeGraphSchema.index({ difficultyLevel: 1 });
knowledgeGraphSchema.index({ category: 1 });
knowledgeGraphSchema.index({ diseaseName: 'text', description: 'text', symptomTags: 'text', lesionTags: 'text' });

// 知识图谱模型
const KnowledgeGraph = mongoose.model('KnowledgeGraph', knowledgeGraphSchema);

module.exports = KnowledgeGraph;
