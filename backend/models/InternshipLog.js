const mongoose = require('mongoose');

// 实习日志状态枚举
const LOG_STATUS = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'];

// 实习日志模型Schema
const internshipLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  caseImageUrls: {
    type: [String],
    default: []
  },
  studentDiagnosis: {
    type: String,
    trim: true
  },
  aiReference: {
    type: String,
    trim: true
  },
  gpsLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  mentorComment: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'DRAFT',
    enum: LOG_STATUS
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  indexes: [
    { studentId: 1, logDate: 1 }, // 复合索引，提高按学生和日期查询的效率
    { mentorId: 1, status: 1 } // 复合索引，便于导师查看待审批日志
  ]
});

// 实习日志模型
const InternshipLog = mongoose.model('InternshipLog', internshipLogSchema);

module.exports = InternshipLog;