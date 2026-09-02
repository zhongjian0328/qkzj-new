const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 用户角色枚举
const ROLE_TYPES = ['FARMER', 'INSTITUTION', 'STUDENT', 'TEACHER', 'VETERINARIAN', 'RESEARCHER', 'ADMIN'];
const SUB_ROLES = {
  FARMER: ['SMALL', 'COOPERATIVE', 'ENTERPRISE'],
  INSTITUTION: ['CDC', 'RESEARCH_INSTITUTE', 'SERVICE_PROVIDER'],
  STUDENT: ['LEARNING_STUDENT', 'COGNITIVE_INTERN', 'ADVANCED_INTERN'],
  TEACHER: ['TEACHER'],
  VETERINARIAN: ['GENERAL', 'SPECIALIST'],
  RESEARCHER: ['RESEARCHER_GENERAL', 'LAB_RESEARCHER'],
  ADMIN: ['SYSTEM']
};
// 认证状态枚举
const AUTH_STATUS = ['UNVERIFIED', 'PENDING', 'VERIFIED'];

// 用户模型Schema
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^1[3-9]\d{9}$/ // 手机号格式验证
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: 'https://s.coze.cn/image/rFqxc53MSiw/'
  },
  roleType: {
    type: String,
    required: true,
    enum: ROLE_TYPES
  },
  subRole: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return SUB_ROLES[this.roleType] && SUB_ROLES[this.roleType].includes(v);
      },
      message: props => `${props.value} 不是 ${props.path} 的有效值`
    }
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  authStatus: {
    type: String,
    default: 'UNVERIFIED',
    enum: AUTH_STATUS
  },
  schoolId: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password; // 输出JSON时不包含密码
      return ret;
    }
  }
});

// 密码加密中间件（Mongoose 7+ async pre-hook 不再传递 next）
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 密码验证方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 更新最后登录时间
userSchema.methods.updateLastLogin = async function() {
  this.lastLoginDate = new Date();
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;