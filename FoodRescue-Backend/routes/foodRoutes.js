const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem'); // Import the Schema we made earlier

// @route   POST /api/food/add
// @desc    Add a new leftover food item
// @access  Public (for now)
router.post('/add', async (req, res) => {
  try {
    // 1. Get data from the user (the "Request Body")
    const { name, description, originalPrice, discountedPrice, quantity, category, expiryTime, vendorId } = req.body;

    // 2. Create a new FoodItem in memory
    const newFood = new FoodItem({
      vendor: vendorId, // In real app, this comes from login
      name,
      description,
      originalPrice,
      discountedPrice,
      quantity,
      category,
      expiryTime: new Date(expiryTime) // Ensure date is formatted correctly
    });

    // 3. Save to MongoDB
    const savedFood = await newFood.save();

    // 4. Send success message back
    res.status(201).json({ message: "Food added successfully!", data: savedFood });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/food/all
// @desc    Get food with Filters (Category, Price)
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const { category, maxPrice } = req.query; // Grab data from the URL link

    // 1. Build a "Query Object" (Start with finding everything available)
    let query = { isAvailable: true };

    // 2. If user specifically asks for a category, add it to the filter
    if (category) {
      query.category = category;
    }

    // 3. If user sets a budget (maxPrice), show items cheaper than that
    if (maxPrice) {
      query.discountedPrice = { $lte: maxPrice }; // $lte means "Less Than or Equal"
    }

    // 4. Run the smart query
    const foodItems = await FoodItem.find(query);
    
    res.status(200).json(foodItems);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;