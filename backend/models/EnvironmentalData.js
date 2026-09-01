const mongoose = require('mongoose');

const environmentalDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'BreedingBatch' },
  farmName: { type: String, required: true },
  // 四类检测数据
  temperature: { type: Number }, // °C
  humidity: { type: Number }, // %
  ammonia: { type: Number }, // ppm NH3
  co2: { type: Number }, // ppm
  pm25: { type: Number }, // mg/m³
  pm10: { type: Number }, // mg/m³
  // 记录信息
  recordDate: { type: Date, required: true, default: Date.now },
  recorder: { type: String },
  notes: { type: String },
  // 超标预警标记（由后端自动计算）
  alerts: [{
    type: String, // 'HIGH_TEMP' | 'LOW_TEMP' | 'HIGH_HUMIDITY' | 'HIGH_AMMONIA' | 'HIGH_CO2' | 'HIGH_PM25'
    message: String,
    value: Number,
    threshold: Number
  }]
}, {
  timestamps: true
});

// 索引
environmentalDataSchema.index({ userId: 1, recordDate: -1 });
environmentalDataSchema.index({ batchId: 1, recordDate: -1 });
environmentalDataSchema.index({ farmName: 1, recordDate: -1 });

module.exports = mongoose.model('EnvironmentalData', environmentalDataSchema);
