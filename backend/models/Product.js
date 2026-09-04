const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = ['veterinary_drug', 'feed', 'vaccine', 'consultation', 'diagnosis_service', 'equipment'];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: PRODUCT_CATEGORIES
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: '件'
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  }
}, {
  timestamps: true
});

productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);
