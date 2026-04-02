export const CATEGORIES = ['Salary','Freelance','Investment','Food','Rent','Transport','Shopping','Utilities','Entertainment','Health','Other'];

export const initialTransactions = [
  { id: 1,  date: '2026-03-01', amount: 85000, category: 'Salary',        type: 'income',  description: 'Monthly salary' },
  { id: 2,  date: '2026-03-02', amount: 12000, category: 'Rent',          type: 'expense', description: 'Monthly rent' },
  { id: 3,  date: '2026-03-05', amount: 3500,  category: 'Food',          type: 'expense', description: 'Groceries & supermarket' },
  { id: 4,  date: '2026-03-07', amount: 2200,  category: 'Transport',     type: 'expense', description: 'Fuel & cab rides' },
  { id: 5,  date: '2026-03-10', amount: 15000, category: 'Freelance',     type: 'income',  description: 'Client project payment' },
  { id: 6,  date: '2026-03-12', amount: 4800,  category: 'Food',          type: 'expense', description: 'Restaurant & dining out' },
  { id: 7,  date: '2026-03-15', amount: 7500,  category: 'Shopping',      type: 'expense', description: 'Clothes & accessories' },
  { id: 8,  date: '2026-03-17', amount: 1800,  category: 'Utilities',     type: 'expense', description: 'Electricity & internet' },
  { id: 9,  date: '2026-03-19', amount: 4200,  category: 'Entertainment', type: 'expense', description: 'OTT subscriptions & movies' },
  { id: 10, date: '2026-03-22', amount: 20000, category: 'Investment',    type: 'income',  description: 'Dividend income' },
  { id: 11, date: '2026-03-24', amount: 2800,  category: 'Health',        type: 'expense', description: 'Gym & medicines' },
  { id: 12, date: '2026-03-26', amount: 1600,  category: 'Transport',     type: 'expense', description: 'Monthly metro pass' },
  { id: 13, date: '2026-02-01', amount: 85000, category: 'Salary',        type: 'income',  description: 'Monthly salary' },
  { id: 14, date: '2026-02-03', amount: 12000, category: 'Rent',          type: 'expense', description: 'Monthly rent' },
  { id: 15, date: '2026-02-08', amount: 5200,  category: 'Food',          type: 'expense', description: 'Groceries & dining' },
  { id: 16, date: '2026-02-12', amount: 10000, category: 'Freelance',     type: 'income',  description: 'Side project payment' },
  { id: 17, date: '2026-02-15', amount: 6000,  category: 'Shopping',      type: 'expense', description: 'Electronics' },
  { id: 18, date: '2026-02-20', amount: 1500,  category: 'Utilities',     type: 'expense', description: 'Bills' },
  { id: 19, date: '2026-02-22', amount: 3000,  category: 'Entertainment', type: 'expense', description: 'Events & outings' },
  { id: 20, date: '2026-02-28', amount: 2200,  category: 'Health',        type: 'expense', description: 'Doctor & pharmacy' },
];

export function generateBalanceTrend(transactions) {
  const days = [];
  const today = new Date('2026-03-28');
  let running = 42000;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    transactions.filter(t => new Date(t.date).toDateString() === d.toDateString())
      .forEach(t => { running += t.type === 'income' ? t.amount : -t.amount; });
    days.push({ date: label, balance: running });
  }
  return days;
}

export function getSpendingByCategory(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export const CHART_COLORS       = ['#3B8EFF','#22C55E','#FBBF24','#F87171','#A78BFA','#22D3EE','#FB923C','#F472B6','#34D399','#818CF8'];
export const CHART_COLORS_LIGHT = ['#1D6FEB','#16A34A','#D97706','#DC2626','#7C3AED','#0891B2','#EA580C','#DB2777','#059669','#4F46E5'];
