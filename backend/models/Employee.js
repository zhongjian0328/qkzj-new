const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'staff',
    trim: true
  },
  permissions: {
    type: [String],
    default: []
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
