const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  
  quantity: { type: Number, default: 1 },
  
  pickupCode: { type: String, required: true },
  
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);