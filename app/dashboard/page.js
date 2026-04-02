'use client';
import AppShell from '../../components/layout/AppShell';
import MetricCard from '../../components/dashboard/MetricCard';
import BalanceTrendChart from '../../components/dashboard/BalanceTrendChart';
import SpendingPieChart from '../../components/dashboard/SpendingPieChart';
import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '../../lib/mockData';

export default function DashboardPage() {
  const { balance, totalIncome, totalExpenses, transactions } = useApp();

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <AppShell title="Dashboard" subtitle="Welcome back — here's your financial overview">
      <div className="space-y-5 max-w-7xl mx-auto">

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard title="Total Balance"   amount={balance}        icon={Wallet}      type="balance" delay={50}  badge={{ label: 'Updated just now' }} />
          <MetricCard title="Total Income"    amount={totalIncome}    icon={TrendingUp}  type="income"  delay={120} badge={{ label: 'All income sources', positive: true }} />
          <MetricCard title="Total Expenses"  amount={totalExpenses}  icon={TrendingDown} type="expense" delay={190} badge={{ label: 'All expense categories', positive: false }} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-2">
            <SpendingPieChart />
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          className="card p-5 opacity-0-init animate-fade-up"
          style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">Recent Transactions</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Latest activity</p>
            </div>
            <Link
              href="/transactions"
              className="flex items-center gap-1 text-[12px] font-semibold text-[var(--accent)] hover:opacity-75 transition-opacity"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-0.5">
            {recentTx.map((tx, i) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--surface-2)] transition-all duration-150 group cursor-default"
                style={{ animationDelay: `${400 + i * 40}ms` }}
              >
                {/* Icon */}
                <div className={`
                  w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0
                  ${tx.type === 'income' ? 'bg-[var(--income-bg)]' : 'bg-[var(--expense-bg)]'}
                `}>
                  {tx.type === 'income'
                    ? <TrendingUp  size={14} className="text-[var(--income)]" />
                    : <TrendingDown size={14} className="text-[var(--expense)]" />
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{tx.description}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {tx.category} · {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>

                {/* Amount */}
                <span className={`font-display font-bold text-[14px] flex-shrink-0 ${tx.type === 'income' ? 'text-[var(--income)]' : 'text-[var(--expense)]'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
