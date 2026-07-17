const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// POST: Add Expense
router.post('/add', async (req, res) => {
  const { username, title, category, amount, date, notes } = req.body;

  if (!username) {
    console.error('Missing username in request body');
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const newExpense = new Expense({
      user_email: username,
      title,
      category,
      amount,
      date,
      notes
    });

    const savedExpense = await newExpense.save();
    res.json({ success: true, message: 'Expense added successfully', expense: savedExpense });
  } catch (err) {
    console.error('Error inserting expense:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// GET: Fetch Expenses by User Email
router.get('/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    const expenses = await Expense.find({ user_email: userEmail }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// DELETE: Delete Expense by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Expense.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

module.exports = router;
