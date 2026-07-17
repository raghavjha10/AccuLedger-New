const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  client_name: { type: String, required: true },
  invoice_number: { type: String, required: true },
  amount: { type: Number, required: true },
  due_date: { type: String, required: true }, // Keep as String to match front-end format (YYYY-MM-DD)
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
