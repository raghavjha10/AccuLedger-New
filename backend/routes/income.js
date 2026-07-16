const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// Route: POST /api/income
router.post('/', async (req, res) => {
  const { email, source, amount, category, date, notes } = req.body;

  try {
    const newIncome = new Income({
      email,
      source,
      amount,
      category,
      date,
      notes
    });

    const savedIncome = await newIncome.save();
    res.json({ success: true, message: "Income saved successfully", income: savedIncome });
  } catch (err) {
    console.error("Income insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// GET: Fetch Incomes by User Email (optional, but good to have)
router.get('/:email', async (req, res) => {
  const userEmail = req.params.email;
  try {
    const incomes = await Income.find({ email: userEmail }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error("Error fetching incomes:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE: Delete Income by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Income.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Income not found' });
    }
    res.json({ success: true, message: 'Income deleted successfully' });
  } catch (err) {
    console.error('Error deleting income:', err);
    res.status(500).json({ error: 'Failed to delete income' });
  }
});

module.exports = router;
