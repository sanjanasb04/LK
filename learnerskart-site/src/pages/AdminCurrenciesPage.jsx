import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { Globe, DollarSign, Edit2, Check, X, RefreshCw, Info } from 'lucide-react';

const AdminCurrenciesPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCode, setEditingCode] = useState(null);
  const [editForm, setEditForm] = useState({
    rate: '',
    symbol: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not super admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/currencies');
      if (res.data.success) {
        setCurrencies(res.data.currencies);
      }
    } catch (err) {
      setError('Failed to fetch currency settings from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCurrencies();
    }
  }, [user]);

  const handleEditClick = (curr) => {
    setEditingCode(curr.code);
    setEditForm({
      rate: curr.rate,
      symbol: curr.symbol
    });
  };

  const handleSave = async (code) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/currencies/${code}`, {
        rate: Number(editForm.rate),
        symbol: editForm.symbol
      });
      if (res.data.success) {
        setCurrencies(prev =>
          prev.map(c => (c.code === code ? { ...c, rate: Number(editForm.rate), symbol: editForm.symbol } : c))
        );
        setEditingCode(null);
        // Force refresh local storage country selection rate if matching
        const saved = localStorage.getItem('lk_selected_country');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.code === code) {
            localStorage.setItem('lk_selected_country', JSON.stringify({
              ...parsed,
              rate: Number(editForm.rate),
              symbol: editForm.symbol
            }));
          }
        }
      }
    } catch (err) {
      alert('Error updating currency: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 select-none text-left py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Panel */}
          <main className="flex-grow space-y-6 w-full">
            {/* Header */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-extrabold text-textdark">Currency Rate Settings</h2>
                <p className="text-xs text-textmuted font-semibold leading-tight uppercase tracking-wider">
                  Admin Control Panel • Configure Conversion Rates by Location
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl hidden sm:block">
                <Globe className="w-6 h-6 text-primary" />
              </div>
            </div>

            {/* Explanatory Info Card */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 text-left flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-primary uppercase tracking-wide">💡 Manual Rates Control</h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-1">
                  Exchange multipliers are defined relative to Indian Rupee (INR). For example, if USD is configured with rate <code>0.012</code>, a <code>₹10,000</code> course will display as <code>$120</code>. Updates will propagate immediately across all course cards, shopping carts, and checkout pages.
                </p>
              </div>
            </div>

            {/* List Table Card */}
            <div className="bg-white border border-slate-100 shadow-md rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <h3 className="font-extrabold text-sm text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Active Currencies exchange board
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1.5 rounded">
                  Supported Countries: {currencies.length}
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="text-xs text-textmuted font-semibold">Loading exchange rates...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-xs font-bold text-rose-600">{error}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                        <th className="px-6 py-4">Country Name</th>
                        <th className="px-6 py-4">Country Code</th>
                        <th className="px-6 py-4">Currency Code</th>
                        <th className="px-6 py-4">Currency Symbol</th>
                        <th className="px-6 py-4">Exchange Multiplier (1 INR =)</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {currencies.map((curr) => {
                        const isEditing = editingCode === curr.code;

                        return (
                          <tr key={curr.code} className="hover:bg-slate-50/50 transition-colors">
                            {/* Country flag + name */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg">{curr.flag}</span>
                                <span className="font-extrabold text-textdark">{curr.name}</span>
                              </div>
                            </td>

                            {/* Code */}
                            <td className="px-6 py-4 font-bold">{curr.code}</td>

                            {/* Currency */}
                            <td className="px-6 py-4 uppercase font-bold text-slate-500">{curr.currency}</td>

                            {/* Symbol */}
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.symbol}
                                  onChange={(e) => setEditForm({ ...editForm, symbol: e.target.value })}
                                  className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-primary font-bold"
                                />
                              ) : (
                                <span className="font-mono font-black text-slate-700">{curr.symbol}</span>
                              )}
                            </td>

                            {/* Rate */}
                            <td className="px-6 py-4">
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={editForm.rate}
                                  onChange={(e) => setEditForm({ ...editForm, rate: e.target.value })}
                                  className="w-28 px-2.5 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-primary font-bold"
                                />
                              ) : (
                                <span className="font-mono font-black text-slate-800">{curr.rate}</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              {isEditing ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => handleSave(curr.code)}
                                    disabled={actionLoading}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-success border border-emerald-100 rounded-lg transition-colors"
                                    title="Save changes"
                                  >
                                    {actionLoading ? (
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => setEditingCode(null)}
                                    disabled={actionLoading}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-lg transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleEditClick(curr)}
                                  className="p-2 border border-slate-100 hover:bg-slate-50 text-primary rounded-lg transition-colors inline-flex items-center gap-1 font-bold"
                                >
                                  <Edit2 className="w-3.5 h-3.5" /> Edit Rate
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCurrenciesPage;
