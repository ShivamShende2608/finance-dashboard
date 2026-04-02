'use client';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown, FileX } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../lib/mockData';
import TransactionModal from './TransactionModal';

export default function TransactionTable() {
  const { transactions, role, deleteTransaction } = useApp();
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField]  = useState('date');
  const [sortDir, setSortDir]      = useState('desc');
  const [modal, setModal]          = useState(false);
  const [editTx, setEditTx]        = useState(null);

  const isAdmin = role === 'Admin';

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = transactions
    .filter(t =>
      (typeFilter === 'all' || t.type === typeFilter) &&
      (t.category.toLowerCase().includes(search.toLowerCase()) ||
       t.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let av = sortField === 'amount' ? +a.amount : sortField === 'date' ? new Date(a.date) : a[sortField];
      let bv = sortField === 'amount' ? +b.amount : sortField === 'date' ? new Date(b.date) : b[sortField];
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronsUpDown size={11} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={11} className="text-[var(--accent)]" /> : <ChevronDown size={11} className="text-[var(--accent)]" />;
  };

  const TH = ({ field, children, className = '' }) => (
    <th
      className={`px-4 py-3 text-left text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest cursor-pointer select-none whitespace-nowrap ${className}`}
      onClick={() => field && toggleSort(field)}
    >
      <span className="flex items-center gap-1.5 hover:text-[var(--text-secondary)] transition-colors">
        {children}{field && <SortIcon field={field} />}
      </span>
    </th>
  );

  return (
    <>
      {modal && (
        <TransactionModal
          onClose={() => { setModal(false); setEditTx(null); }}
          editTx={editTx}
        />
      )}

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search category or description..."
            className="input-premium pl-9 pr-4 py-2.5"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-[var(--surface-2)] rounded-xl p-1">
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition-all duration-150 ${
                typeFilter === f
                  ? f === 'income'
                    ? 'bg-[var(--income-bg)] text-[var(--income)]'
                    : f === 'expense'
                      ? 'bg-[var(--expense-bg)] text-[var(--expense)]'
                      : 'bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >{f === 'all' ? 'All' : f}</button>
          ))}
        </div>

        {isAdmin && (
          <button className="btn-primary whitespace-nowrap" onClick={() => { setEditTx(null); setModal(true); }}>
            <Plus size={15} /> Add Transaction
          </button>
        )}
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)]">
                <TH field="date">Date</TH>
                <TH field="category">Category</TH>
                <TH className="hidden md:table-cell">Description</TH>
                <TH field="amount">Amount</TH>
                <TH field="type">Type</TH>
                {isAdmin && <TH>Actions</TH>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center">
                        <FileX size={24} className="text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[13.5px] text-[var(--text-primary)]">No data found</p>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">Try adjusting your search or filters</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className="table-row-hover border-b border-[var(--border-subtle)] last:border-0"
                    style={{ animationDelay: `${i * 20}ms` }}
                  >
                    <td className="px-4 py-3.5 text-[12.5px] text-[var(--text-muted)] whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[12px] font-semibold text-[var(--text-primary)] bg-[var(--surface-2)] px-2.5 py-1 rounded-lg border border-[var(--border-subtle)]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[12.5px] text-[var(--text-secondary)] hidden md:table-cell max-w-[200px]">
                      <span className="truncate block">{tx.description}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-display font-bold text-[13.5px] ${tx.type === 'income' ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`pill ${tx.type === 'income' ? 'pill-income' : 'pill-expense'}`}>
                        {tx.type}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => { setEditTx(tx); setModal(true); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--blue)] hover:bg-[var(--blue-bg)] transition-all"
                          ><Pencil size={13} /></button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--expense)] hover:bg-[var(--expense-bg)] transition-all"
                          ><Trash2 size={13} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <p className="text-[11.5px] text-[var(--text-muted)]">
              {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </p>
            <p className="text-[11.5px] text-[var(--text-muted)]">
              {filtered.filter(t=>t.type==='income').length} income · {filtered.filter(t=>t.type==='expense').length} expense
            </p>
          </div>
        )}
      </div>
    </>
  );
}
