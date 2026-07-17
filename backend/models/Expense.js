const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true }, // Keep as String to match front-end format (YYYY-MM-DD)
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
