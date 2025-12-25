const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

router.post('/place', async (req, res) => {
  try {
    const { userId, foodId, quantity } = req.body;

    const food = await FoodItem.findById(foodId);
    
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.quantity < quantity) {
      return res.status(400).json({ message: "Opps! Not enough items left." });
    }

    const secretCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder = new Order({
      userId,
      foodItem: foodId,
      quantity,
      pickupCode: secretCode
    });

    food.quantity = food.quantity - quantity;
    if (food.quantity === 0) {
      food.isAvailable = false;
    }

    await newOrder.save();
    await food.save(); 

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