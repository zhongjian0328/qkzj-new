const InternshipLog = require('../models/InternshipLog');
const User = require('../models/User');

// 获取实习日志列表
exports.getLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, mentorId } = req.query;
    const filter = {};
    // 根据角色确定查询范围
    if (req.user.roleType === 'STUDENT') {
      filter.studentId = req.user.id;
    } else if (req.user.roleType === 'TEACHER') {
      filter.mentorId = req.user.id;
    } else {
      // 管理员可查全部，其他角色只能查自己的
      filter.studentId = req.user.id;
    }
    if (status) filter.status = status.toUpperCase();
    if (mentorId) filter.mentorId = mentorId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await InternshipLog.countDocuments(filter);
    const logs = await InternshipLog.find(filter)
      .sort({ logDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('studentId', 'nickname phoneNumber')
      .populate('mentorId', 'nickname');

    res.status(200).json({
      status: 'success',
      data: { logs, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 创建实习日志
exports.createLog = async (req, res, next) => {
  try {
    const { logDate, content, caseImageUrls, studentDiagnosis, gpsLocation } = req.body;
    if (!content) return res.status(400).json({ status: 'error', message: '日志内容不能为空' });

    // 查找当前学生的导师
    const student = await User.findById(req.user.id);
    const mentorId = student.mentorId;

    const log = await InternshipLog.create({
      studentId: req.user.id,
      mentorId: mentorId || req.user.id, // 无导师时暂存为自己
      logDate: logDate || new Date(),
      content,
      caseImageUrls: caseImageUrls || [],
      studentDiagnosis,
      gpsLocation
    });
    res.status(201).json({ status: 'success', data: { log } });
  } catch (error) { next(error); }
};

// 获取实习日志详情
exports.getLogById = async (req, res, next) => {
  try {
    const log = await InternshipLog.findById(req.params.logId)
      .populate('studentId', 'nickname phoneNumber')
      .populate('mentorId', 'nickname');
    if (!log) return res.status(404).json({ status: 'error', message: '日志不存在' });
    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) { next(error); }
};

// 导师批注实习日志
exports.commentLog = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ status: 'error', message: '批注内容不能为空' });

    const log = await InternshipLog.findById(req.params.logId);
    if (!log) return res.status(404).json({ status: 'error', message: '日志不存在' });

    log.mentorComment = comment;
    log.status = 'APPROVED';
    await log.save();

    res.status(200).json({ status: 'success', data: { log } });
  } catch (error) { next(error); }
};

// 获取学生列表（教师视角：查看自己指导的学生）
exports.getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { roleType: 'STUDENT' };

    // 教师只看自己指导的学生
    if (req.user.roleType === 'TEACHER') {
      filter.mentorId = req.user.id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password')
      .sort({ lastLoginDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { students, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};
