import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [rates, setRates] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: ''
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/expenses');
      setExpenses(res.data.expenses);
      setRates(res.data.marketRates);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date) return;
    try {
      await axios.post('http://localhost:5000/expenses', formData);
      fetchExpenses(); // Refresh the list
      setFormData({ amount: '', category: 'Food', date: '' });
    } catch (err) {
      console.error('Error saving expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  // Dynamically calculate total spending
  const totalSpending = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Market Overview Segment */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
          
          <div className="pl-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Expense Tracker</h1>
            <p className="text-teal-400 text-sm mt-1 font-medium">MERN Stack Edition</p>
          </div>
          
          <div className="mt-6 md:mt-0 bg-gray-900/50 p-4 rounded-xl border border-gray-700 w-full md:w-auto backdrop-blur-sm">
            <h2 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest flex items-center">
              <svg className="w-4 h-4 mr-1 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Market Overview (USD)
            </h2>
            {rates && rates.rates ? (
              <div className="flex space-x-6 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs">EUR</span>
                  <span className="text-teal-300 font-mono font-medium">{rates.rates.EUR}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs">GBP</span>
                  <span className="text-teal-300 font-mono font-medium">{rates.rates.GBP}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs">JPY</span>
                  <span className="text-teal-300 font-mono font-medium">{rates.rates.JPY}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 animate-pulse">Loading live rates...</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50 h-fit">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Expense
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Amount ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input 
                    type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-8 pr-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
                <select 
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                >
                  <option value="Food">🍔 Food</option>
                  <option value="Travel">✈️ Travel</option>
                  <option value="Bills">🧾 Bills</option>
                  <option value="Others">📦 Others</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Date</label>
                <input 
                  type="date" name="date" value={formData.date} onChange={handleChange} required
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all dark:[color-scheme:dark]"
                />
              </div>
              
              <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-teal-500/25 mt-4 transform hover:-translate-y-0.5">
                Save Expense
              </button>
            </form>
          </div>

          {/* Dashboard Table Section */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-bold text-white mb-4 sm:mb-0 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Recent Expenses
              </h2>
              
              <div className="bg-gray-900 px-5 py-2.5 rounded-xl border border-gray-700 shadow-inner">
                <span className="text-gray-400 text-sm mr-2 font-medium">Total Spent:</span>
                <span className="text-2xl font-black text-white tracking-tight">${totalSpending.toFixed(2)}</span>
              </div>
            </div>

            <div className="overflow-x-auto bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800/80">
                  <tr className="text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-4 px-5 font-semibold">Date</th>
                    <th className="py-4 px-5 font-semibold">Category</th>
                    <th className="py-4 px-5 font-semibold">Amount</th>
                    <th className="py-4 px-5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          <p>No expenses recorded yet.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp._id} className="hover:bg-gray-800/80 transition-colors group">
                        <td className="py-4 px-5 text-gray-300 text-sm whitespace-nowrap">
                          {new Date(exp.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span className="bg-gray-800 text-xs px-3 py-1.5 rounded-md text-gray-300 border border-gray-700 shadow-sm">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-mono font-medium text-gray-200">
                          ${exp.amount.toFixed(2)}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button 
                            onClick={() => handleDelete(exp._id)}
                            className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
