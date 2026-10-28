// client/src/pages/Dashboard.jsx
// Dashboard for viewing, creating, updating, and deleting expenses with income/expense summaries

import { useState, useEffect, useMemo } from 'react';
import API from '../api/axios';

const CATEGORIES = [
  'Food & Dining',
  'Salary',
  'Freelance',
  'Rent & Housing',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Investment',
  'Other',
];

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');

  // State for creating a new expense/income
  const [newItem, setNewItem] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense',
    date: getTodayDateString(),
  });
  const [createLoading, setCreateLoading] = useState(false);

  // State for editing an expense/income
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense',
    date: getTodayDateString(),
  });

  // Fetch all expenses for the authenticated user on mount
  useEffect(() => {
    let ignore = false;

    API.get('/expenses')
      .then((res) => {
        if (!ignore) {
          setExpenses(res.data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.message || 'Failed to load expenses.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Compute summary metrics (total income, total expense, balance)
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      if (item.type === 'income') {
        income += amt;
      } else {
        expense += amt;
      }
    });

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [expenses]);

  // Handle new transaction input changes
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new transaction
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;
    if (newItem.amount === '' || Number(newItem.amount) < 0) return;

    setCreateLoading(true);
    try {
      const payload = {
        title: newItem.title.trim(),
        amount: Number(newItem.amount),
        category: newItem.category,
        type: newItem.type,
        date: newItem.date ? new Date(newItem.date).toISOString() : new Date().toISOString(),
      };

      const res = await API.post('/expenses', payload);
      setExpenses((prev) => [res.data, ...prev]);
      setNewItem({
        title: '',
        amount: '',
        category: newItem.type === 'income' ? 'Salary' : 'Food & Dining',
        type: newItem.type,
        date: getTodayDateString(),
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add transaction.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Enable edit mode for a transaction
  const startEdit = (item) => {
    setEditingId(item._id);
    const formattedDate = item.date
      ? new Date(item.date).toISOString().split('T')[0]
      : getTodayDateString();

    setEditFormData({
      title: item.title,
      amount: item.amount,
      category: item.category || 'Other',
      type: item.type || 'expense',
      date: formattedDate,
    });
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Save updated transaction
  const handleUpdateSubmit = async (id) => {
    if (!editFormData.title.trim()) return;
    if (editFormData.amount === '' || Number(editFormData.amount) < 0) return;

    try {
      const payload = {
        title: editFormData.title.trim(),
        amount: Number(editFormData.amount),
        category: editFormData.category,
        type: editFormData.type,
        date: editFormData.date ? new Date(editFormData.date).toISOString() : new Date().toISOString(),
      };

      const res = await API.put(`/expenses/${id}`, payload);
      setExpenses((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update transaction.');
    }
  };

  // Delete a transaction
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await API.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete transaction.');
    }
  };

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Filtered expenses based on filter tab
  const filteredExpenses = useMemo(() => {
    if (filterType === 'all') return expenses;
    return expenses.filter((item) => item.type === filterType);
  }, [expenses, filterType]);

  return (
    <div className="dashboard-container">
      {/* Summary Cards */}
      <section className="summary-section">
        <div className="summary-card income-card">
          <span className="summary-label">Total Income</span>
          <span className="summary-amount income-val">
            +{formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="summary-card expense-card">
          <span className="summary-label">Total Expense</span>
          <span className="summary-amount expense-val">
            -{formatCurrency(totalExpense)}
          </span>
        </div>
        <div className="summary-card balance-card">
          <span className="summary-label">Net Balance</span>
          <span className={`summary-amount ${balance >= 0 ? 'balance-pos' : 'balance-neg'}`}>
            {balance >= 0 ? '' : '-'}{formatCurrency(Math.abs(balance))}
          </span>
        </div>
      </section>

      {/* Add New Transaction Section */}
      <section className="create-section">
        <h2>Add Transaction</h2>
        <form onSubmit={handleCreateSubmit} className="create-form">
          <div className="form-row-grid">
            <div className="form-group flex-2">
              <label htmlFor="new-title">Title *</label>
              <input
                id="new-title"
                type="text"
                name="title"
                value={newItem.title}
                onChange={handleNewChange}
                placeholder="e.g. Monthly Salary, Grocery shopping"
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="new-amount">Amount ($) *</label>
              <input
                id="new-amount"
                type="number"
                name="amount"
                step="0.01"
                min="0"
                value={newItem.amount}
                onChange={handleNewChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="new-type">Type *</label>
              <select
                id="new-type"
                name="type"
                value={newItem.type}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewItem((prev) => ({
                    ...prev,
                    type: val,
                    category: val === 'income' ? 'Salary' : 'Food & Dining',
                  }));
                }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="new-category">Category *</label>
              <select
                id="new-category"
                name="category"
                value={newItem.category}
                onChange={handleNewChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="new-date">Date *</label>
              <input
                id="new-date"
                type="date"
                name="date"
                value={newItem.date}
                onChange={handleNewChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={createLoading}
          >
            {createLoading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </section>

      {/* Transactions List Section */}
      <section className="items-section">
        <div className="items-header-bar">
          <div className="items-header-title">
            <h2>Transactions</h2>
            <span className="items-count">({filteredExpenses.length})</span>
          </div>

          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-btn ${filterType === 'income' ? 'active' : ''}`}
              onClick={() => setFilterType('income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`}
              onClick={() => setFilterType('expense')}
            >
              Expense
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <p>
              {filterType === 'all'
                ? 'No transactions recorded yet. Add your first income or expense above!'
                : `No ${filterType} transactions found.`}
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {filteredExpenses.map((item) => {
              const isEditing = editingId === item._id;
              const isIncome = item.type === 'income';

              return (
                <div
                  key={item._id}
                  className={`transaction-card ${isIncome ? 'border-income' : 'border-expense'}`}
                >
                  {isEditing ? (
                    // Edit Mode
                    <div className="card-edit-mode">
                      <div className="form-row-grid">
                        <div className="form-group flex-2">
                          <label>Title</label>
                          <input
                            type="text"
                            value={editFormData.title}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="form-group flex-1">
                          <label>Amount ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editFormData.amount}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                amount: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div className="form-group flex-1">
                          <label>Type</label>
                          <select
                            value={editFormData.type}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </div>

                        <div className="form-group flex-1">
                          <label>Category</label>
                          <select
                            value={editFormData.category}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group flex-1">
                          <label>Date</label>
                          <input
                            type="date"
                            value={editFormData.date}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="card-actions-edit">
                        <button
                          onClick={() => handleUpdateSubmit(item._id)}
                          className="btn btn-success-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-secondary-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="transaction-row">
                      <div className="transaction-info">
                        <div className="transaction-header">
                          <span className={`type-badge badge-${item.type || 'expense'}`}>
                            {item.type || 'expense'}
                          </span>
                          <span className="category-badge">{item.category || 'Other'}</span>
                          <span className="transaction-date">
                            {new Date(item.date || item.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="transaction-title">{item.title}</h3>
                      </div>

                      <div className="transaction-meta">
                        <span className={`transaction-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                        </span>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(item)}
                            className="btn btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn btn-danger-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
