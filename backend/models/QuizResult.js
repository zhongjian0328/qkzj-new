const mongoose = require('mongoose');

// 测验记录模型
const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 参与的题目列表
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionBank',
      required: true
    },
    userAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  totalQuestions: {
    type: Number,
    required: true
  },
  correctCount: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  // 筛选条件快照
  filterSnapshot: {
    knowledgePoint: String,
    difficulty: String,
    tags: [String]
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

quizResultSchema.index({ userId: 1, completedAt: -1 });

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
