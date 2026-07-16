const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expense');
const incomeRoutes = require('./routes/income');
const invoiceRoutes = require('./routes/invoice');
const settingRoutes = require('./routes/setting');
const passwordRoutes = require('./routes/passwordRoutes');
const userRoutes = require('./routes/user'); // original user.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/api', authRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/user', settingRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/user', userRoutes); // keep original user routes for fallback

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
