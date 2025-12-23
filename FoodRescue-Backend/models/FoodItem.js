const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true },
  description: { type: String },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  expiryTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// 👇 THIS LINE IS THE KEY
module.exports = mongoose.model('FoodItem', FoodItemSchema);