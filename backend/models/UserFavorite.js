const mongoose = require('mongoose');

const userFavoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeArticle',
    required: true
  }
}, {
  timestamps: true
});

// 索引
userFavoriteSchema.index({ userId: 1, articleId: 1 }, { unique: true });
userFavoriteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('UserFavorite', userFavoriteSchema);
