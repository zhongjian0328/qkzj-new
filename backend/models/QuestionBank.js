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
  timestamps: true,
  indexes: [
    { knowledgePoint: 1 }, // 按知识点索引，便于按知识点组卷
    { difficulty: 1 }, // 按难度索引，便于按难度组卷
    { tags: 1 }, // 按标签索引，便于分类查询
    { questionType: 1 } // 按题型索引，便于按题型组卷
  ]
});

// 题库模型
const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);

module.exports = QuestionBank;