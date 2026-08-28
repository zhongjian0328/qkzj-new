const mongoose = require('mongoose');

// 产品类型枚举
const PRODUCT_TYPES = ['VETERINARY_DRUG', 'FEED', 'VACCINE', 'CONSULTATION', 'DIAGNOSIS_SERVICE'];
// 订单状态枚举
const ORDER_STATUS = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];

// 订单模型Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productType: {
    type: String,
    required: true,
    enum: PRODUCT_TYPES
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  diagnosisRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiagnosisRecord'
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  serviceDescription: {
    type: String,
    trim: true
  },
  orderStatus: {
    type: String,
    default: 'PENDING',
    enum: ORDER_STATUS
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  paymentInfo: {
    paymentMethod: {
      type: String
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED']
    },
    transactionId: {
      type: String
    },
    paymentDate: {
      type: Date
    }
  },
  deliveryInfo: {
    recipientName: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String
    },
    deliveryMethod: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    deliveryDate: {
      type: Date
    }
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
  timestamps: true
});

// 索引
orderSchema.index({ userId: 1 });
orderSchema.index({ serviceProviderId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ productType: 1 });
orderSchema.index({ orderDate: -1 });

// 订单模型
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;