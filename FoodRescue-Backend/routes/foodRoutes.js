const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem'); 

router.post('/add', async (req, res) => {
  try {
    const { name, description, originalPrice, discountedPrice, quantity, category, expiryTime, vendorId } = req.body;

    const newFood = new FoodItem({
      vendor: vendorId, 
      name,
      description,
      originalPrice,
      discountedPrice,
      quantity,
      category,
      expiryTime: new Date(expiryTime) 
    });

    const savedFood = await newFood.save();

    res.status(201).json({ message: "Food added successfully!", data: savedFood });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const { category, maxPrice } = req.query; 

    let query = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    if (maxPrice) {
      query.discountedPrice = { $lte: maxPrice }; 
    }

    const foodItems = await FoodItem.find(query);
    
    res.status(200).json(foodItems);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;