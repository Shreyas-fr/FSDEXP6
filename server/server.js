require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Expense = require('./models/Expense');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/expenseTracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET /expenses
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    
    // External API Integration for exchange rates
    let exchangeRates = null;
    try {
      const response = await axios.get('https://api.frankfurter.app/latest?from=USD');
      exchangeRates = response.data;
    } catch (apiError) {
      console.error('Failed to fetch exchange rates', apiError.message);
    }

    res.json({
      expenses,
      marketRates: exchangeRates
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /expenses
app.post('/expenses', async (req, res) => {
  try {
    const { amount, category, date } = req.body;
    const newExpense = new Expense({ amount, category, date });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create expense' });
  }
});

// DELETE /expenses/:id
app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
