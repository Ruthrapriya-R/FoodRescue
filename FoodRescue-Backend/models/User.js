const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // This is the Magic Switch: Are they a 'student' or a 'vendor'?
  role: { 
    type: String, 
    enum: ['student', 'vendor'], 
    default: 'student' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);