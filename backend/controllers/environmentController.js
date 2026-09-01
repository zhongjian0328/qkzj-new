const EnvironmentalData = require('../models/EnvironmentalData');

// 预警阈值（模块级常量）
const THRESHOLDS = {
  tempHigh: 35,
  tempLow: 10,
  humidityHigh: 80,
  ammoniaHigh: 25,
  co2High: 3000,
  pm25High: 0.075, // mg/m³
  pm10High: 0.15
};

/**
 * 根据输入数据自动生成超标预警数组
 * @param {Object} data - 环境检测数据
 * @returns {Array} 预警数组
 */
function checkAlerts(data) {
  const alerts = [];

  if (data.temperature !== undefined && data.temperature !== null) {
    if (data.temperature > THRESHOLDS.tempHigh) {
      alerts.push({
        type: 'HIGH_TEMP',
        message: `温度过高: ${data.temperature}°C（阈值: ${THRESHOLDS.tempHigh}°C）`,
        value: data.temperature,
        threshold: THRESHOLDS.tempHigh
      });
    } else if (data.temperature < THRESHOLDS.tempLow) {
      alerts.push({
        type: 'LOW_TEMP',
        message: `温度过低: ${data.temperature}°C（阈值: ${THRESHOLDS.tempLow}°C）`,
        value: data.temperature,
        threshold: THRESHOLDS.tempLow
      });
    }
  }

  if (data.humidity !== undefined && data.humidity !== null && data.humidity > THRESHOLDS.humidityHigh) {
    alerts.push({
      type: 'HIGH_HUMIDITY',
      message: `湿度过高: ${data.humidity}%（阈值: ${THRESHOLDS.humidityHigh}%）`,
      value: data.humidity,
      threshold: THRESHOLDS.humidityHigh
    });
  }

  if (data.ammonia !== undefined && data.ammonia !== null && data.ammonia > THRESHOLDS.ammoniaHigh) {
    alerts.push({
      type: 'HIGH_AMMONIA',
      message: `氨气浓度过高: ${data.ammonia}ppm（阈值: ${THRESHOLDS.ammoniaHigh}ppm）`,
      value: data.ammonia,
      threshold: THRESHOLDS.ammoniaHigh
    });
  }

  if (data.co2 !== undefined && data.co2 !== null && data.co2 > THRESHOLDS.co2High) {
    alerts.push({
      type: 'HIGH_CO2',
      message: `二氧化碳浓度过高: ${data.co2}ppm（阈值: ${THRESHOLDS.co2High}ppm）`,
      value: data.co2,
      threshold: THRESHOLDS.co2High
    });
  }

  if (data.pm25 !== undefined && data.pm25 !== null && data.pm25 > THRESHOLDS.pm25High) {
    alerts.push({
      type: 'HIGH_PM25',
      message: `PM2.5浓度过高: ${data.pm25}mg/m³（阈值: ${THRESHOLDS.pm25High}mg/m³）`,
      value: data.pm25,
      threshold: THRESHOLDS.pm25High
    });
  }

  if (data.pm10 !== undefined && data.pm10 !== null && data.pm10 > THRESHOLDS.pm10High) {
    alerts.push({
      type: 'HIGH_PM10',
      message: `PM10浓度过高: ${data.pm10}mg/m³（阈值: ${THRESHOLDS.pm10High}mg/m³）`,
      value: data.pm10,
      threshold: THRESHOLDS.pm10High
    });
  }

  return alerts;
}

// 创建环境数据记录
exports.createRecord = async (req, res, next) => {
  try {
    const {
      farmName, temperature, humidity, ammonia, co2, pm25, pm10,
      batchId, recordDate, recorder, notes
    } = req.body;

    if (!farmName) {
      return res.status(400).json({ status: 'error', message: '养殖场名称不能为空' });
    }

    const data = { temperature, humidity, ammonia, co2, pm25, pm10 };
    const alerts = checkAlerts(data);

    const record = await EnvironmentalData.create({
      userId: req.user.id,
      farmName,
      temperature,
      humidity,
      ammonia,
      co2,
      pm25,
      pm10,
      batchId,
      recordDate: recordDate || new Date(),
      recorder,
      notes,
      alerts
    });

    res.status(201).json({
      status: 'success',
      message: '环境数据记录创建成功',
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

// 获取环境数据记录列表
exports.getRecords = async (req, res, next) => {
  try {
    const { batchId, startDate, endDate, farmName, page = 1, limit = 20 } = req.query;

    const filter = { userId: req.user.id };

    if (batchId) {
      filter.batchId = batchId;
    }

    if (farmName) {
      filter.farmName = { $regex: farmName, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await EnvironmentalData.countDocuments(filter);
    const records = await EnvironmentalData.find(filter)
      .sort({ recordDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: {
        records,
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

// 获取单条环境数据记录详情
exports.getRecordById = async (req, res, next) => {
  try {
    const record = await EnvironmentalData.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ status: 'error', message: '记录不存在' });
    }

    res.status(200).json({
      status: 'success',
      data: { record }
    });
  } catch (error) {
    next(error);
  }
};

// 更新环境数据记录
exports.updateRecord = async (req, res, next) => {
  try {
    const record = await EnvironmentalData.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ status: 'error', message: '记录不存在' });
    }

    const allowedFields = ['farmName', 'temperature', 'humidity', 'ammonia', 'co2', 'pm25', 'pm10', 'batchId', 'recordDate', 'recorder', 'notes'];
    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ status: 'error', message: '没有可更新的字段' });
    }

    // 合并更新后的数据用于重新计算预警
    const mergedData = { ...record.toObject(), ...updateData };
    updateData.alerts = checkAlerts(mergedData);

    const updatedRecord = await EnvironmentalData.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: '环境数据记录更新成功',
      data: { record: updatedRecord }
    });
  } catch (error) {
    next(error);
  }
};

// 删除环境数据记录
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await EnvironmentalData.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!record) {
      return res.status(404).json({ status: 'error', message: '记录不存在' });
    }

    res.status(200).json({
      status: 'success',
      message: '环境数据记录删除成功'
    });
  } catch (error) {
    next(error);
  }
};

// 获取环境数据统计
exports.getStatistics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const records = await EnvironmentalData.find(filter);

    const fields = ['temperature', 'humidity', 'ammonia', 'co2', 'pm25', 'pm10'];
    const avg = {};
    const max = {};
    const min = {};

    for (const field of fields) {
      const values = records.map(r => r[field]).filter(v => v !== undefined && v !== null);

      if (values.length > 0) {
        avg[field] = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(3));
        max[field] = Math.max(...values);
        min[field] = Math.min(...values);
      } else {
        avg[field] = null;
        max[field] = null;
        min[field] = null;
      }
    }

    // 统计预警总数
    const alertCount = records.reduce((sum, r) => sum + (r.alerts ? r.alerts.length : 0), 0);

    res.status(200).json({
      status: 'success',
      data: {
        avg,
        max,
        min,
        alertCount,
        recordCount: records.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取预警记录列表
exports.getAlerts = async (req, res, next) => {
  try {
    const { alertType, startDate, endDate } = req.query;

    const filter = {
      userId: req.user.id,
      'alerts.0': { $exists: true } // 至少有一条预警
    };

    if (alertType) {
      filter['alerts.type'] = alertType;
    }

    if (startDate || endDate) {
      filter.recordDate = {};
      if (startDate) filter.recordDate.$gte = new Date(startDate);
      if (endDate) filter.recordDate.$lte = new Date(endDate);
    }

    const records = await EnvironmentalData.find(filter)
      .sort({ recordDate: -1 });

    // 如果指定了 alertType，只返回匹配的预警项
    const result = records.map(record => {
      const obj = record.toObject();
      if (alertType) {
        obj.alerts = obj.alerts.filter(a => a.type === alertType);
      }
      return obj;
    });

    res.status(200).json({
      status: 'success',
      data: { records: result, total: result.length }
    });
  } catch (error) {
    next(error);
  }
};
