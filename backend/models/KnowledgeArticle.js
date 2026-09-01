const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true // markdown 格式
  },
  category: {
    type: String,
    required: true,
    enum: ['disease_prevention', 'breeding_technology', 'nutrition_feeding', 'farm_management', 'policy_regulation', 'case_study']
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coverImage: {
    type: String
  },
  summary: {
    type: String,
    maxlength: 200 // 200字以内的摘要
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
  }
}, {
  timestamps: true
});

// 索引
knowledgeArticleSchema.index({ category: 1, status: 1, createdAt: -1 });
knowledgeArticleSchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
knowledgeArticleSchema.index({ title: 'text', summary: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
