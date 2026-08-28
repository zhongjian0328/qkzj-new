const mongoose = require('mongoose');

// 知识图谱模型Schema
const knowledgeGraphSchema = new mongoose.Schema({
  diseaseName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: {
    type: [String],
    default: []
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
knowledgeGraphSchema.index({ diseaseName: 1 });
knowledgeGraphSchema.index({ tags: 1 });
knowledgeGraphSchema.index({ difficultyLevel: 1 });

// 知识图谱模型
const KnowledgeGraph = mongoose.model('KnowledgeGraph', knowledgeGraphSchema);

module.exports = KnowledgeGraph;