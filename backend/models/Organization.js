const mongoose = require('mongoose');

// 组织机构类型枚举
const ORG_TYPES = ['SCHOOL', 'ENTERPRISE', 'GOV', 'RESEARCH_INSTITUTE', 'SERVICE_PROVIDER'];

// 组织机构模型Schema
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ORG_TYPES
  },
  licenseImgUrl: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true,
    match: /^1[3-9]\d{9}$/ // 手机号格式验证
  },
  address: {
    type: String,
    trim: true
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
  timestamps: true
});

// 组织机构模型
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;