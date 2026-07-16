const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true }, // Keep as String to match front-end format (YYYY-MM-DD)
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
