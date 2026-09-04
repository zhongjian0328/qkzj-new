const BreedingBatch = require('../models/BreedingBatch');
const ProductionData = require('../models/ProductionData');
const Employee = require('../models/Employee');

// 生产数据导出（CSV格式）
exports.exportProductionData = async (req, res, next) => {
  try {
    const { batchId, startDate, endDate } = req.query;
    if (!batchId) return res.status(400).json({ status: 'error', message: '批次ID不能为空' });

    // 验证批次归属
    const batch = await BreedingBatch.findOne({ _id: batchId, enterpriseId: req.user.id });
    if (!batch) return res.status(404).json({ status: 'error', message: '批次不存在' });

    const filter = { batchId };
    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const records = await ProductionData.find(filter).sort({ recordDate: 1 });

    // 生成 CSV
    const headers = ['日期', '死亡数量', '耗料量(kg)', '备注'];
    const rows = records.map(r => [
      r.recordDate ? new Date(r.recordDate).toISOString().split('T')[0] : '',
      r.deathCount || 0,
      r.feedConsumption || 0,
      (r.notes || '').replace(/,/g, '，')
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const bom = '﻿'; // UTF-8 BOM，确保 Excel 正确识别中文
    const filename = encodeURIComponent(`${batch.batchName}_生产数据_${new Date().toISOString().split('T')[0]}.csv`);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(bom + csv);
  } catch (error) { next(error); }
};

// 获取批次列表
exports.getBatches = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { enterpriseId: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await BreedingBatch.countDocuments(filter);
    const batches = await BreedingBatch.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { batches, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 创建批次
exports.createBatch = async (req, res, next) => {
  try {
    const { batchName, species, initialQuantity, entryDate } = req.body;
    if (!batchName || !species || !initialQuantity) {
      return res.status(400).json({ status: 'error', message: '批次名称、品种和初始数量不能为空' });
    }
    const batch = await BreedingBatch.create({
      enterpriseId: req.user.id,
      batchName,
      species,
      initialQuantity,
      currentQuantity: initialQuantity,
      entryDate: entryDate || new Date()
    });
    res.status(201).json({ status: 'success', data: { batch } });
  } catch (error) { next(error); }
};

// 获取批次详情
exports.getBatchById = async (req, res, next) => {
  try {
    const batch = await BreedingBatch.findOne({ _id: req.params.batchId, enterpriseId: req.user.id });
    if (!batch) return res.status(404).json({ status: 'error', message: '批次不存在' });
    res.status(200).json({ status: 'success', data: { batch } });
  } catch (error) { next(error); }
};

// 更新批次
exports.updateBatch = async (req, res, next) => {
  try {
    const allowed = ['batchName', 'species', 'currentQuantity', 'status'];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    const batch = await BreedingBatch.findOneAndUpdate(
      { _id: req.params.batchId, enterpriseId: req.user.id },
      update, { new: true, runValidators: true }
    );
    if (!batch) return res.status(404).json({ status: 'error', message: '批次不存在' });
    res.status(200).json({ status: 'success', data: { batch } });
  } catch (error) { next(error); }
};

// 删除批次
exports.deleteBatch = async (req, res, next) => {
  try {
    const result = await BreedingBatch.deleteOne({ _id: req.params.batchId, enterpriseId: req.user.id });
    if (!result.deletedCount) return res.status(404).json({ status: 'error', message: '批次不存在' });
    res.status(200).json({ status: 'success', message: '批次已删除' });
  } catch (error) { next(error); }
};

// 获取死淘/耗料记录
exports.getDeathFeedRecords = async (req, res, next) => {
  try {
    const { batchId, page = 1, limit = 20, startDate, endDate } = req.query;
    if (!batchId) return res.status(400).json({ status: 'error', message: '批次ID不能为空' });

    const filter = { batchId, recorderId: req.user.id };
    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await ProductionData.countDocuments(filter);
    const records = await ProductionData.find(filter).sort({ recordDate: -1 }).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { records, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 创建死淘/耗料记录
exports.createDeathFeedRecord = async (req, res, next) => {
  try {
    const { batchId, recordDate, deathCount, feedConsumption, notes } = req.body;
    if (!batchId) return res.status(400).json({ status: 'error', message: '批次ID不能为空' });

    const record = await ProductionData.create({
      batchId,
      recorderId: req.user.id,
      recordDate: recordDate || new Date(),
      deathCount: deathCount || 0,
      feedConsumption: feedConsumption || 0,
      notes
    });
    res.status(201).json({ status: 'success', data: { record } });
  } catch (error) { next(error); }
};

// 获取员工列表
exports.getEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { employees, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) { next(error); }
};

// 创建员工
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, role, permissions, phoneNumber } = req.body;
    if (!name) return res.status(400).json({ status: 'error', message: '员工姓名不能为空' });

    const employee = await Employee.create({
      userId: req.user.id,
      name,
      role: role || 'staff',
      permissions: permissions || [],
      phoneNumber
    });
    res.status(201).json({ status: 'success', data: { employee } });
  } catch (error) { next(error); }
};

// 更新员工权限
exports.updateEmployeePermission = async (req, res, next) => {
  try {
    const { role, permissions } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.employeeId, userId: req.user.id },
      { role, permissions },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ status: 'error', message: '员工不存在' });
    res.status(200).json({ status: 'success', data: { employee } });
  } catch (error) { next(error); }
};
