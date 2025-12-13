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
  timestamps: true,
  indexes: [
    { userId: 1 }, // 按用户ID索引，便于用户查看自己的订单
    { serviceProviderId: 1 }, // 按服务商ID索引，便于服务商管理订单
    { orderStatus: 1 }, // 按订单状态索引，便于订单状态管理
    { productType: 1 }, // 按产品类型索引，便于统计分析
    { orderDate: -1 } // 按订单日期倒序索引，便于查看最新订单
  ]
});

// 订单模型
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;