'use client';
import { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { CATEGORIES } from '../../lib/mockData';
import { useApp } from '../../context/AppContext';

const empty = { date: '', amount: '', category: 'Food', type: 'expense', description: '' };

export default function TransactionModal({ onClose, editTx }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(editTx ? { ...editTx, amount: String(editTx.amount) } : empty);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.date)                                             e.date        = 'Required';
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount   = 'Enter a valid amount';
    if (!form.description.trim())                               e.description = 'Required';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: +form.amount };
    editTx ? editTransaction(payload) : addTransaction(payload);
    onClose();
  };

  const Field = ({ label, field, children }) => (
    <div>
      <label className="block text-[11.5px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {errors[field] && <p className="text-[11px] text-[var(--expense)] mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="card w-full max-w-[440px] shadow-[var(--shadow-elevated)] animate-scale-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">
              {editTx ? 'Edit Transaction' : 'New Transaction'}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Fill in the details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-all">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--surface-2)] rounded-xl">
            {[
              { v: 'income',  label: 'Income',  icon: TrendingUp  },
              { v: 'expense', label: 'Expense', icon: TrendingDown },
            ].map(({ v, label, icon: Icon }) => (
              <button
                key={v}
                onClick={() => set('type', v)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                  form.type === v
                    ? v === 'income'
                      ? 'bg-[var(--income-bg)] text-[var(--income)] shadow-sm border border-[var(--income)]/20'
                      : 'bg-[var(--expense-bg)] text-[var(--expense)] shadow-sm border border-[var(--expense)]/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" field="date">
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="input-premium px-3 py-2" />
            </Field>
            <Field label="Amount (₹)" field="amount">
              <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)}
                placeholder="0" className="input-premium px-3 py-2" />
            </Field>
          </div>

          <Field label="Category" field="category">
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input-premium px-3 py-2">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Description" field="description">
            <input type="text" value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What was this for?" className="input-premium px-3 py-2" />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex gap-2.5 px-5 py-4 border-t border-[var(--border-subtle)]">
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={submit} className="btn-primary flex-1 justify-center">
            {editTx ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}
