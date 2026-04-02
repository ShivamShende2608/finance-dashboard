'use client';
import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { initialTransactions } from '../lib/mockData';

const Ctx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':         return { ...state, ...action.payload };
    case 'ADD':          return { ...state, transactions: [{ ...action.payload, id: Date.now() }, ...state.transactions] };
    case 'EDIT':         return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE':       return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
    case 'SET_ROLE':     return { ...state, role: action.payload };
    default:             return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { transactions: initialTransactions, role: 'Admin' });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem('ff_state');
      if (s) dispatch({ type: 'LOAD', payload: JSON.parse(s) });
    } catch (_) {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('ff_state', JSON.stringify(state)); } catch (_) {}
  }, [state, ready]);

  const totalIncome   = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance       = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return (
    <Ctx.Provider value={{
      transactions: state.transactions,
      role: state.role,
      totalIncome, totalExpenses, balance, savingsRate,
      addTransaction:    (tx) => dispatch({ type: 'ADD',      payload: tx }),
      editTransaction:   (tx) => dispatch({ type: 'EDIT',     payload: tx }),
      deleteTransaction: (id) => dispatch({ type: 'DELETE',   payload: id }),
      setRole:          (r)  => dispatch({ type: 'SET_ROLE',  payload: r  }),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
