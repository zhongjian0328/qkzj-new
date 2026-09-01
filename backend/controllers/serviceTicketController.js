const ServiceTicket = require('../models/ServiceTicket');
const ServiceRecord = require('../models/ServiceRecord');

/**
 * 自动生成工单编号：TK-YYYYMMDD-XXXX
 */
async function generateTicketNo() {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  let ticketNo;
  let exists = true;
  while (exists) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    ticketNo = `TK-${dateStr}-${rand}`;
    exists = await ServiceTicket.findOne({ ticketNo });
  }
  return ticketNo;
}

// 创建工单
exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority, relatedBatchId, relatedDiagnosisId, location, scheduledDate, images } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ status: 'error', message: '标题、描述和类别为必填项' });
    }

    const ticketNo = await generateTicketNo();

    const ticket = await ServiceTicket.create({
      ticketNo,
      requesterId: req.user.id,
      title,
      description,
      category,
      priority: priority || 'medium',
      relatedBatchId,
      relatedDiagnosisId,
      location,
      scheduledDate,
      images: images || []
    });

    res.status(201).json({
      status: 'success',
      message: '工单创建成功',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

// 我的工单（作为发起方）
exports.getMyTickets = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { requesterId: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ServiceTicket.countDocuments(filter);
    const tickets = await ServiceTicket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assigneeId', 'nickname avatar')
      .populate('relatedBatchId', 'farmName')
      .populate('relatedDiagnosisId', 'title');

    res.status(200).json({
      status: 'success',
      data: {
        tickets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// 我承接的工单（作为承接方）
exports.getAssignedTickets = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { assigneeId: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ServiceTicket.countDocuments(filter);
    const tickets = await ServiceTicket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('requesterId', 'nickname avatar');

    res.status(200).json({
      status: 'success',
      data: {
        tickets,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// 工单详情
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id)
      .populate('requesterId', 'nickname avatar')
      .populate('assigneeId', 'nickname avatar')
      .populate('messages.senderId', 'nickname avatar')
      .populate('relatedBatchId', 'farmName')
      .populate('relatedDiagnosisId', 'title');

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    // 所有权校验
    const requesterId = ticket.requesterId._id || ticket.requesterId;
    const assigneeId = ticket.assigneeId ? (ticket.assigneeId._id || ticket.assigneeId) : null;
    if (requesterId.toString() !== req.user.id && (!assigneeId || assigneeId.toString() !== req.user.id)) {
      return res.status(403).json({ status: 'error', message: '无权查看该工单' });
    }

    res.status(200).json({
      status: 'success',
      data: { ticket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 承接工单
exports.acceptTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    if (ticket.status !== 'open') {
      return res.status(400).json({ status: 'error', message: '工单已非待承接状态' });
    }

    ticket.assigneeId = req.user.id;
    ticket.status = 'accepted';
    await ticket.save();

    res.status(200).json({
      status: 'success',
      message: '工单承接成功',
      data: { ticket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 更新工单
exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    const requesterId = ticket.requesterId.toString();
    const assigneeId = ticket.assigneeId ? ticket.assigneeId.toString() : null;
    if (requesterId !== req.user.id && assigneeId !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '无权修改该工单' });
    }

    const allowedFields = ['title', 'description', 'category', 'priority', 'location', 'scheduledDate', 'images'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: '没有可更新的字段' });
    }

    const updatedTicket = await ServiceTicket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: '工单更新成功',
      data: { ticket: updatedTicket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 添加沟通消息
exports.addMessage = async (req, res, next) => {
  try {
    const { content, imageUrls } = req.body;

    if (!content) {
      return res.status(400).json({ status: 'error', message: '消息内容不能为空' });
    }

    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    const requesterId = ticket.requesterId.toString();
    const assigneeId = ticket.assigneeId ? ticket.assigneeId.toString() : null;
    if (requesterId !== req.user.id && assigneeId !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '无权操作该工单' });
    }

    ticket.messages.push({
      senderId: req.user.id,
      content,
      imageUrls: imageUrls || [],
      createdAt: new Date()
    });

    await ticket.save();

    res.status(200).json({
      status: 'success',
      message: '消息发送成功',
      data: { ticket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 完成工单
exports.completeTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    const requesterId = ticket.requesterId.toString();
    const assigneeId = ticket.assigneeId ? ticket.assigneeId.toString() : null;
    if (requesterId !== req.user.id && assigneeId !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '无权操作该工单' });
    }

    if (['completed', 'cancelled'].includes(ticket.status)) {
      return res.status(400).json({ status: 'error', message: '工单已完成或已取消' });
    }

    ticket.status = 'completed';
    ticket.completedDate = new Date();
    await ticket.save();

    // 自动生成服务记录
    const serviceRecord = await ServiceRecord.create({
      ticketId: ticket._id,
      providerId: ticket.assigneeId || req.user.id,
      clientId: ticket.requesterId,
      serviceType: ticket.category === 'diagnosis_help' ? 'diagnosis'
        : ticket.category === 'treatment_guidance' ? 'treatment'
        : ticket.category === 'farm_visit' ? 'farm_visit'
        : ticket.category === 'training' ? 'training'
        : 'consultation',
      content: ticket.description,
      images: ticket.images,
      outcome: '工单已正常完成'
    });

    res.status(200).json({
      status: 'success',
      message: '工单已完成，服务记录已生成',
      data: { ticket, serviceRecord }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 评价工单
exports.rateTicket = async (req, res, next) => {
  try {
    const { score, comment } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ status: 'error', message: '评分必须为 1-5 之间的整数' });
    }

    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    if (ticket.requesterId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '只有发起方可以评价工单' });
    }

    if (ticket.status !== 'completed') {
      return res.status(400).json({ status: 'error', message: '只能评价已完成的工单' });
    }

    if (ticket.rating && ticket.rating.score) {
      return res.status(400).json({ status: 'error', message: '工单已评价，不能重复评价' });
    }

    ticket.rating = { score, comment };
    await ticket.save();

    res.status(200).json({
      status: 'success',
      message: '工单评价成功',
      data: { ticket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};

// 取消工单
exports.cancelTicket = async (req, res, next) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ status: 'error', message: '工单不存在' });
    }

    if (ticket.requesterId.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: '只有发起方可以取消工单' });
    }

    if (ticket.status === 'completed') {
      return res.status(400).json({ status: 'error', message: '已完成的工单不能取消' });
    }

    if (ticket.status === 'cancelled') {
      return res.status(400).json({ status: 'error', message: '工单已取消' });
    }

    ticket.status = 'cancelled';
    await ticket.save();

    res.status(200).json({
      status: 'success',
      message: '工单已取消',
      data: { ticket }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ status: 'error', message: '无效的工单ID' });
    }
    next(error);
  }
};
