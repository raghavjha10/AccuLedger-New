const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");

router.post("/add", async (req, res) => {
  const { user_email, client_name, invoice_number, amount, due_date, notes } = req.body;

  if (!user_email || !client_name || !invoice_number) {
    return res.status(400).send("Missing required fields!");
  }

  try {
    const newInvoice = new Invoice({
      user_email,
      client_name,
      invoice_number,
      amount,
      due_date,
      notes
    });

    const savedInvoice = await newInvoice.save();
    res.json({ success: true, message: "Invoice saved successfully", invoice: savedInvoice });
  } catch (err) {
    console.error("Error inserting invoice:", err);
    res.status(500).send("Error saving invoice");
  }
});

// GET: Fetch Invoices by User Email (optional, but good to have)
router.get("/:email", async (req, res) => {
  const userEmail = req.params.email;
  try {
    const invoices = await Invoice.find({ user_email: userEmail }).sort({ due_date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).send("Error fetching invoices");
  }
});

// DELETE: Delete Invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Invoice.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

module.exports = router;
