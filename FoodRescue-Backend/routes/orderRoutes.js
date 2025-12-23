const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// @route   POST /api/order/place
// @desc    User buys food -> Generate Code -> Decrease Quantity
router.post('/place', async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    // 1. Find the food item in DB
    const food = await FoodItem.findById(foodId);
    
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // 2. REAL WORLD CHECK: Is there enough food left?
    if (food.quantity < quantity) {
      return res.status(400).json({ message: "Opps! Not enough items left." });
    }

    // 3. Generate a Random 4-Digit Pickup Code (e.g., 5592)
    const secretCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 4. Create the Order
    const newOrder = new Order({
      userId,
      foodItem: foodId,
      quantity,
      pickupCode: secretCode
    });

    // 5. CRITICAL: Decrease the food quantity in the inventory!
    food.quantity = food.quantity - quantity;
    // If quantity hits 0, hide the item automatically
    if (food.quantity === 0) {
      food.isAvailable = false;
    }

    // 6. Save both changes
    await newOrder.save();
    await food.save(); // Save the updated quantity

    res.status(201).json({ 
      message: "Order Success! Go pick it up.", 
      pickupCode: secretCode, 
      order: newOrder 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;