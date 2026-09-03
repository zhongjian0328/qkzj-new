const { body, param, query, validationResult } = require('express-validator');

/**
 * 验证结果处理中间件 — 如果验证失败，返回 400 错误
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: errors.array()[0]?.msg || '输入参数校验失败',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// ── 认证端点验证规则 ──

// 注册验证
const validateRegister = [
  body('phoneNumber')
    .isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('password')
    .isLength({ min: 6, max: 32 }).withMessage('密码长度需为6-32位'),
  body('nickname')
    .notEmpty().withMessage('昵称不能为空')
    .isLength({ max: 20 }).withMessage('昵称最长20个字符'),
  body('roleType')
    .isIn(['FARMER', 'INSTITUTION', 'STUDENT', 'TEACHER']).withMessage('无效的角色类型'),
  body('subRole').notEmpty().withMessage('请选择具体身份'),
  handleValidationErrors
];

// 登录验证
const validateLogin = [
  body('phoneNumber')
    .isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('password')
    .notEmpty().withMessage('密码不能为空'),
  handleValidationErrors
];

// 验证码获取验证
const validateGetCode = [
  body('phoneNumber')
    .isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('type')
    .optional()
    .isIn(['register', 'login', 'forgot']).withMessage('无效的验证码类型'),
  handleValidationErrors
];

// 验证码登录验证
const validateLoginWithCode = [
  body('phoneNumber')
    .isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('code')
    .isLength({ min: 6, max: 6 }).isNumeric().withMessage('验证码为6位数字'),
  handleValidationErrors
];

// 体验登录验证
const validateExperienceLogin = [
  body('roleType')
    .isIn(['FARMER', 'INSTITUTION', 'STUDENT', 'TEACHER']).withMessage('无效的角色类型'),
  body('subRole').notEmpty().withMessage('请选择具体身份'),
  handleValidationErrors
];

// 角色选择验证
const validateSelectRole = [
  body('roleType')
    .isIn(['FARMER', 'INSTITUTION', 'STUDENT', 'TEACHER']).withMessage('无效的角色类型'),
  body('subRole').notEmpty().withMessage('请选择具体身份'),
  handleValidationErrors
];

// 密码修改验证
const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('当前密码不能为空'),
  body('newPassword')
    .isLength({ min: 6, max: 32 }).withMessage('新密码长度需为6-32位'),
  handleValidationErrors
];

// 密码找回验证
const validateForgotPassword = [
  body('phoneNumber')
    .isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('code')
    .isLength({ min: 6, max: 6 }).isNumeric().withMessage('验证码为6位数字'),
  body('newPassword')
    .isLength({ min: 6, max: 32 }).withMessage('新密码长度需为6-32位'),
  handleValidationErrors
];

// ── 生产管理端点验证规则 ──

// 创建批次验证
const validateCreateBatch = [
  body('batchName').notEmpty().withMessage('批次名称不能为空').isLength({ max: 50 }).withMessage('批次名称最长50字符'),
  body('species').notEmpty().withMessage('品种不能为空'),
  body('initialQuantity').isInt({ min: 1 }).withMessage('初始数量需为正整数'),
  body('entryDate').notEmpty().withMessage('入场日期不能为空'),
  handleValidationErrors
];

// 更新批次验证
const validateUpdateBatch = [
  param('batchId').isMongoId().withMessage('无效的批次ID'),
  body('batchName').optional().isLength({ max: 50 }).withMessage('批次名称最长50字符'),
  handleValidationErrors
];

// 创建死淘记录验证
const validateCreateDeathFeedRecord = [
  body('batchId').isMongoId().withMessage('无效的批次ID'),
  body('recordDate').notEmpty().withMessage('记录日期不能为空'),
  body('deathCount').isInt({ min: 0 }).withMessage('死亡数需为非负整数'),
  body('feedConsumption').isFloat({ min: 0 }).withMessage('耗料量需为非负数'),
  handleValidationErrors
];

// 创建员工验证
const validateCreateEmployee = [
  body('name').notEmpty().withMessage('员工姓名不能为空').isLength({ max: 20 }).withMessage('姓名最长20字符'),
  body('role').notEmpty().withMessage('角色不能为空'),
  handleValidationErrors
];

// ── 工单端点验证规则 ──

const validateCreateTicket = [
  body('title').notEmpty().withMessage('工单标题不能为空').isLength({ max: 100 }).withMessage('标题最长100字符'),
  body('description').notEmpty().withMessage('工单描述不能为空'),
  body('category').notEmpty().withMessage('工单分类不能为空'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('无效的优先级'),
  handleValidationErrors
];

const validateAddMessage = [
  param('id').isMongoId().withMessage('无效的工单ID'),
  body('content').notEmpty().withMessage('消息内容不能为空'),
  handleValidationErrors
];

const validateRateTicket = [
  param('id').isMongoId().withMessage('无效的工单ID'),
  body('score').isInt({ min: 1, max: 5 }).withMessage('评分需为1-5'),
  handleValidationErrors
];

// ── AI诊断端点验证规则 ──

const validateChatDiagnosis = [
  body('message').notEmpty().withMessage('诊断消息不能为空').isLength({ max: 2000 }).withMessage('消息最长2000字符'),
  handleValidationErrors
];

const validateVetDiagnosis = [
  body('basicInfo').isObject().withMessage('基本信息不能为空'),
  body('basicInfo.farmLocation').notEmpty().withMessage('养殖场位置不能为空'),
  body('basicInfo.chickenBreed').notEmpty().withMessage('品种不能为空'),
  body('basicInfo.ageDays').isInt({ min: 0 }).withMessage('日龄需为非负整数'),
  body('imageUrls').isArray().withMessage('图片URL需为数组'),
  handleValidationErrors
];

const validateAuditReport = [
  param('diagnosisId').isMongoId().withMessage('无效的诊断ID'),
  body('auditStatus').isIn(['REVIEWED', 'REVISED']).withMessage('无效的审核状态'),
  body('auditComments').notEmpty().withMessage('审核意见不能为空'),
  handleValidationErrors
];

// ── 防控预案端点验证规则 ──

const validateGeneratePlan = [
  body('diseaseName').notEmpty().withMessage('疾病名称不能为空'),
  body('severity').optional().isIn(['mild', 'moderate', 'severe', 'critical']).withMessage('无效的严重程度'),
  handleValidationErrors
];

// ── 商业服务端点验证规则 ──

const validateCreateOrder = [
  body('productType').notEmpty().withMessage('产品类型不能为空').isIn(['medicine', 'vaccine', 'disinfectant', 'equipment', 'diagnosis_service', 'consultation']).withMessage('无效的产品类型'),
  handleValidationErrors
];

// ── 环境记录端点验证规则 ──

const validateCreateEnvironmentRecord = [
  body('farmName').notEmpty().withMessage('养殖场名称不能为空'),
  body('temperature').optional().isFloat({ min: -40, max: 60 }).withMessage('温度范围-40~60'),
  body('humidity').optional().isFloat({ min: 0, max: 100 }).withMessage('湿度范围0~100'),
  handleValidationErrors
];

// 死淘记录查询验证（batchId可选，传入时必须为有效ObjectId）
const validateGetDeathFeedRecords = [
  query('batchId').optional().isMongoId().withMessage('无效的批次ID'),
  handleValidationErrors
];

// 生产数据导出验证（batchId可选，传入时必须为有效ObjectId）
const validateExportProductionData = [
  query('batchId').optional().isMongoId().withMessage('无效的批次ID'),
  handleValidationErrors
];

// 批次详情路由参数验证
const validateBatchIdParam = [
  param('batchId').isMongoId().withMessage('无效的批次ID'),
  handleValidationErrors
];

// 员工权限路由参数验证
const validateEmployeeIdParam = [
  param('employeeId').isMongoId().withMessage('无效的员工ID'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateGetCode,
  validateLoginWithCode,
  validateExperienceLogin,
  validateSelectRole,
  validateChangePassword,
  validateForgotPassword,
  // 生产管理
  validateCreateBatch,
  validateUpdateBatch,
  validateCreateDeathFeedRecord,
  validateCreateEmployee,
  validateGetDeathFeedRecords,
  validateExportProductionData,
  validateBatchIdParam,
  validateEmployeeIdParam,
  // 工单
  validateCreateTicket,
  validateAddMessage,
  validateRateTicket,
  // AI诊断
  validateChatDiagnosis,
  validateVetDiagnosis,
  validateAuditReport,
  // 防控预案
  validateGeneratePlan,
  // 商业服务
  validateCreateOrder,
  // 环境记录
  validateCreateEnvironmentRecord,
};
