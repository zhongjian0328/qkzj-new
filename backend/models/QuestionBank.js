const mongoose = require('mongoose');

// 题目类型枚举
const QUESTION_TYPE = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'];
// 难度级别枚举
const DIFFICULTY_LEVEL = ['EASY', 'MEDIUM', 'HARD'];

// 题库模型Schema
const questionBankSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    required: true,
    enum: QUESTION_TYPE
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // 可以是String（单选、判断）或[Number]（多选）或String（简答题）
    required: true
  },
  explanation: {
    type: String,
    trim: true
  },
  knowledgePoint: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: DIFFICULTY_LEVEL,
    default: 'MEDIUM'
  },
  tags: {
    type: [String],
    default: []
  },
  referenceGraphId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeGraph'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  },
  correctRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引
questionBankSchema.index({ knowledgePoint: 1 });
questionBankSchema.index({ difficulty: 1 });
questionBankSchema.index({ tags: 1 });
questionBankSchema.index({ questionType: 1 });

// 题库模型
const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

module.exports = QuestionBank;