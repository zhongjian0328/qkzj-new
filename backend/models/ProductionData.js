const mongoose = require('mongoose');

// 生产数据模型Schema
const productionDataSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BreedingBatch',
    required: true
  },
  recordDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  deathCount: {
    type: Number,
    default: 0,
    min: 0
  },
  feedConsumption: {
    type: Number,
    default: 0,
    min: 0
  },
  recorderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
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
  timestamps: true,
  indexes: [
    { batchId: 1, recordDate: 1 }, // 复合索引，提高按批次和日期查询的效率
    { recordDate: 1 } // 按日期索引，便于统计分析
  ]
});

// 生产数据模型
const ProductionData = mongoose.model('ProductionData', productionDataSchema);

module.exports = ProductionData;