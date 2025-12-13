const mongoose = require('mongoose');

// 批次状态枚举
const BATCH_STATUS = ['ACTIVE', 'FINISHED'];

// 养殖批次模型Schema
const breedingBatchSchema = new mongoose.Schema({
  batchName: {
    type: String,
    required: true,
    trim: true
  },
  enterpriseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  initialQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  currentQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  finishDate: {
    type: Date
  },
  status: {
    type: String,
    default: 'ACTIVE',
    enum: BATCH_STATUS
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
  timestamps: true
});

// 养殖批次模型
const BreedingBatch = mongoose.model('BreedingBatch', breedingBatchSchema);

module.exports = BreedingBatch;