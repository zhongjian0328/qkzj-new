const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// 验证必要的环境变量
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// 生成JWT令牌
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, roleType: user.roleType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 用户注册
exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, nickname, roleType, subRole } = req.body;
    
    // 检查手机号是否已注册
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号已注册' });
    }
    
    // 创建新用户
    const user = await User.create({
      phoneNumber,
      password,
      nickname,
      roleType,
      subRole
    });
    
    // 生成令牌
    const token = generateToken(user);
    
    res.status(201).json({
      status: 'success',
      message: '注册成功',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // 检查手机号和密码
    const user = await User.findOne({ phoneNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: '手机号或密码错误' });
    }
    
    // 更新最后登录时间
    await user.updateLastLogin();
    
    // 生成令牌
    const token = generateToken(user);
    
    res.status(200).json({
      status: 'success',
      message: '登录成功',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取验证码（模拟实现）
exports.getVerificationCode = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    
    // 检查手机号是否已注册
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: '手机号已注册' });
    }
    
    // 模拟发送验证码（实际项目中应调用短信服务API）
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 这里应该将验证码存储到Redis或数据库中，设置过期时间
    // 模拟存储验证码
    console.log(`向手机号 ${phoneNumber} 发送验证码: ${verificationCode}`);
    
    res.status(200).json({
      status: 'success',
      message: '验证码已发送',
      data: {
        verificationCode // 实际项目中不应返回验证码，这里仅用于演示
      }
    });
  } catch (error) {
    next(error);
  }
};

// 验证验证码（模拟实现）
exports.verifyCode = async (req, res, next) => {
  try {
    const { phoneNumber, code } = req.body;
    
    // 模拟验证验证码（实际项目中应从Redis或数据库中获取存储的验证码）
    // 模拟验证码正确
    
    res.status(200).json({
      status: 'success',
      message: '验证码验证成功'
    });
  } catch (error) {
    next(error);
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('organizationId mentorId', 'name');
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户信息
exports.updateUser = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const updateData = req.body;
    
    // 不允许更新敏感字段
    if (updateData.password) {
      return res.status(400).json({ status: 'error', message: '密码更新请使用专门的密码修改接口' });
    }
    if (updateData.phoneNumber) {
      return res.status(400).json({ status: 'error', message: '手机号不允许修改' });
    }
    if (updateData.roleType || updateData.subRole) {
      return res.status(400).json({ status: 'error', message: '角色信息不允许自行修改' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    });
    
    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      message: '用户信息更新成功',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// 用户认证
exports.certify = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { certificationType, documents, additionalInfo } = req.body;
    
    // 更新用户认证状态为待审核
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        authStatus: 'PENDING',
        // 这里应该将认证材料存储到对象存储服务中，并保存URL
        // 模拟存储认证材料
        ...additionalInfo
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    res.status(200).json({
      status: 'success',
      message: '认证材料提交成功，等待审核',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// 密码修改
exports.changePassword = async (req, res, next) => {
  try {
    // 从请求对象中获取用户ID（由authMiddleware设置）
    const userId = req.user.id;
    
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: '用户不存在' });
    }
    
    // 验证当前密码
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ status: 'error', message: '当前密码错误' });
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: '密码修改成功'
    });
  } catch (error) {
    next(error);
  }
};