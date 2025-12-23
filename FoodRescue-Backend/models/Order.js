const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Who is buying? (For now we will just use a fake string ID)
  userId: { type: String, required: true }, 
  
  // What are they buying?
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  
  quantity: { type: Number, default: 1 },
  
  // The Secret Code they show the shop owner
  pickupCode: { type: String, required: true },
  
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);