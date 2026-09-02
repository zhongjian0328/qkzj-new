const User = require('../models/User');
const { notifyUser } = require('./socketService');

/**
 * 预警阈值配置
 */
const ALERT_THRESHOLDS = {
  temperature: { high: 35, low: 10 },
  humidity: { high: 80, low: 40 },
  ammonia: { high: 20 },
  diseaseRate: { high: 10 },   // 发病率 > 10%
  mortalityRate: { high: 5 },  // 死亡率 > 5%
};

/**
 * 检查环境/流调数据并触发预警通知
 * @param {Object} environmentalData - 环境数据 { temperature, humidity, ammonia }
 * @param {Object} surveyData - 流调数据 { diseaseRate, mortalityRate }
 * @param {string} userId - 目标用户 ID
 * @returns {Promise<Array>} 触发的预警列表
 */
async function checkAndTriggerAlerts(environmentalData, surveyData, userId) {
  const alerts = [];

  // --- 环境阈值判断 ---
  if (environmentalData) {
    const { temperature, humidity, ammonia } = environmentalData;

    if (temperature != null) {
      if (temperature > ALERT_THRESHOLDS.temperature.high) {
        alerts.push({
          title: '高温预警',
          message: `当前温度 ${temperature}°C 超过安全阈值 ${ALERT_THRESHOLDS.temperature.high}°C，请注意通风降温，防止热应激。`,
          type: 'warning',
          data: { metric: 'temperature', value: temperature, threshold: ALERT_THRESHOLDS.temperature.high },
        });
      } else if (temperature < ALERT_THRESHOLDS.temperature.low) {
        alerts.push({
          title: '低温预警',
          message: `当前温度 ${temperature}°C 低于安全阈值 ${ALERT_THRESHOLDS.temperature.low}°C，请注意保温防寒。`,
          type: 'warning',
          data: { metric: 'temperature', value: temperature, threshold: ALERT_THRESHOLDS.temperature.low },
        });
      }
    }

    if (humidity != null) {
      if (humidity > ALERT_THRESHOLDS.humidity.high) {
        alerts.push({
          title: '湿度异常预警',
          message: `当前湿度 ${humidity}% 超过安全阈值 ${ALERT_THRESHOLDS.humidity.high}%，高湿环境易滋生细菌和寄生虫，请加强通风和除湿。`,
          type: 'warning',
          data: { metric: 'humidity', value: humidity, threshold: ALERT_THRESHOLDS.humidity.high },
        });
      } else if (humidity < ALERT_THRESHOLDS.humidity.low) {
        alerts.push({
          title: '湿度异常预警',
          message: `当前湿度 ${humidity}% 低于安全阈值 ${ALERT_THRESHOLDS.humidity.low}%，干燥环境易导致呼吸道疾病，请适当增加湿度。`,
          type: 'warning',
          data: { metric: 'humidity', value: humidity, threshold: ALERT_THRESHOLDS.humidity.low },
        });
      }
    }

    if (ammonia != null && ammonia > ALERT_THRESHOLDS.ammonia.high) {
      alerts.push({
        title: '氨气超标预警',
        message: `当前氨气浓度 ${ammonia}ppm 超过安全阈值 ${ALERT_THRESHOLDS.ammonia.high}ppm，有害气体超标，请立即通风换气。`,
        type: 'warning',
        data: { metric: 'ammonia', value: ammonia, threshold: ALERT_THRESHOLDS.ammonia.high },
      });
    }
  }

  // --- 流调阈值判断 ---
  if (surveyData) {
    const { diseaseRate, mortalityRate } = surveyData;

    if (diseaseRate != null && diseaseRate > ALERT_THRESHOLDS.diseaseRate.high) {
      alerts.push({
        title: '疫情预警',
        message: `当前发病率 ${diseaseRate}% 超过安全阈值 ${ALERT_THRESHOLDS.diseaseRate.high}%，存在疫情传播风险，请立即启动防控预案并上报。`,
        type: 'warning',
        data: { metric: 'diseaseRate', value: diseaseRate, threshold: ALERT_THRESHOLDS.diseaseRate.high },
      });
    }

    if (mortalityRate != null && mortalityRate > ALERT_THRESHOLDS.mortalityRate.high) {
      alerts.push({
        title: '死亡预警',
        message: `当前死亡率 ${mortalityRate}% 超过安全阈值 ${ALERT_THRESHOLDS.mortalityRate.high}%，异常死亡情况，请紧急排查原因。`,
        type: 'warning',
        data: { metric: 'mortalityRate', value: mortalityRate, threshold: ALERT_THRESHOLDS.mortalityRate.high },
      });
    }
  }

  // --- 创建通知并推送 ---
  for (const alert of alerts) {
    try {
      const Notification = require('../models/Notification');
      const notification = new Notification({
        userId,
        title: alert.title,
        message: alert.message,
        type: alert.type,
        data: alert.data,
      });
      await notification.save();

      notifyUser(userId, 'notification', {
        _id: notification._id,
        title: alert.title,
        message: alert.message,
        type: alert.type,
        data: alert.data,
        createdAt: notification.createdAt,
      });
    } catch (error) {
      console.error(`[AlertEngine] 创建预警通知失败: ${alert.title}`, error.message);
    }
  }

  return alerts;
}

/**
 * 向指定角色的所有用户广播预警通知
 * @param {Object} alert - 预警对象 { title, message, type, data }
 * @param {string} roleType - 目标用户角色（如 'FARMER'）
 */
async function broadcastAlert(alert, roleType) {
  try {
    const Notification = require('../models/Notification');
    const users = await User.find({ roleType }).select('_id');

    for (const user of users) {
      const notification = new Notification({
        userId: user._id,
        title: alert.title,
        message: alert.message,
        type: alert.type,
        data: alert.data,
      });
      await notification.save();
      notifyUser(user._id.toString(), 'notification', {
        _id: notification._id,
        title: alert.title,
        message: alert.message,
        type: alert.type,
        data: alert.data,
        createdAt: notification.createdAt,
      });
    }

    console.log(`[AlertEngine] 广播预警给 ${users.length} 位 ${roleType} 用户`);
  } catch (error) {
    console.error('[AlertEngine] 广播预警失败:', error.message);
  }
}

module.exports = { checkAndTriggerAlerts, broadcastAlert, ALERT_THRESHOLDS };
