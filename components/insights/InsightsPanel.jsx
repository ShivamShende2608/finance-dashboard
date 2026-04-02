'use client';
import { useApp } from '../../context/AppContext';
import { getSpendingByCategory, formatCurrency, CHART_COLORS, CHART_COLORS_LIGHT } from '../../lib/mockData';
import { TrendingUp, TrendingDown, PiggyBank, Zap, AlertTriangle, CheckCircle2, BarChart3, ArrowUpRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCountUp } from '../../hooks/useCountUp';

function StatCard({ icon: Icon, iconColor, iconBg, label, value, sub, delay = 0, accentBar }) {
  return (
    <div
      className="card p-5 opacity-0-init animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={iconColor} strokeWidth={1.75} />
      </div>
      <p className="text-[11.5px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display font-bold text-[22px] text-[var(--text-primary)] leading-none">{value}</p>
      {sub && <p className="text-[11.5px] text-[var(--text-muted)] mt-1.5 leading-relaxed">{sub}</p>}
      {accentBar !== undefined && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(accentBar, 100)}%`,
                background: accentBar >= 20
                  ? 'var(--income)'
                  : 'var(--expense)',
                boxShadow: `0 0 8px ${accentBar >= 20 ? 'var(--income-bg)' : 'var(--expense-bg)'}`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[var(--text-muted)]">0%</span>
            <span className="text-[10px] text-[var(--text-muted)]">Goal: 20%</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ObservationCard({ icon: Icon, color, text, badge, delay = 0 }) {
  return (
    <div
      className="flex gap-3.5 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] opacity-0-init animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
           style={{ background: `${color}18` }}>
        <Icon size={15} style={{ color }} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{text}</p>
        {badge && (
          <span
            className="inline-block mt-2 text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${color}14`, color }}
          >{badge}</span>
        )}
      </div>
    </div>
  );
}

export default function InsightsPanel() {
  const { transactions, totalIncome, totalExpenses, balance, savingsRate } = useApp();
  const { theme } = useTheme();

  const spending = getSpendingByCategory(transactions);
  const topCat = spending[0];
  const colors = theme === 'dark' ? CHART_COLORS : CHART_COLORS_LIGHT;

  const currentFood = transactions.filter(t => t.date.startsWith('2024-03') && t.category === 'Food' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastFood    = transactions.filter(t => t.date.startsWith('2024-02') && t.category === 'Food' && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const foodPct     = lastFood > 0 ? Math.round(((currentFood - lastFood) / lastFood) * 100) : 0;
  const avgExpense  = totalExpenses > 0 ? Math.round(totalExpenses / transactions.filter(t => t.type === 'expense').length) : 0;

  const observations = [
    {
      icon: foodPct > 0 ? TrendingUp : TrendingDown,
      color: foodPct > 0 ? 'var(--expense)' : 'var(--income)',
      text: `You spent ${Math.abs(foodPct)}% ${foodPct > 0 ? 'more' : 'less'} on Food this month compared to last month. ${foodPct > 0 ? 'Consider cooking at home more often.' : 'Great discipline on dining expenses!'}`,
      badge: foodPct > 0 ? '↑ Increased spending' : '↓ Reduced spending',
    },
    {
      icon: savingsRate >= 20 ? CheckCircle2 : AlertTriangle,
      color: savingsRate >= 20 ? 'var(--income)' : '#F59E0B',
      text: savingsRate >= 20
        ? `Excellent! You're saving ${savingsRate}% of your income. You're above the recommended 20% savings threshold.`
        : `Your savings rate is ${savingsRate}%. Try to reach 20% by reducing discretionary spending like Entertainment or Shopping.`,
      badge: savingsRate >= 20 ? 'On Track' : 'Needs Attention',
    },
    topCat && {
      icon: BarChart3,
      color: 'var(--blue)',
      text: `${topCat.name} is your top expense category this period at ${formatCurrency(topCat.value)}, making up ${Math.round((topCat.value / totalExpenses) * 100)}% of total spending.`,
      badge: 'Top Category',
    },
  ].filter(Boolean);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={PiggyBank} iconColor="text-[var(--accent)]" iconBg="bg-[var(--accent-muted)]"
          label="Savings Rate" value={`${savingsRate}%`}
          sub="of total income" accentBar={savingsRate} delay={50}
        />
        <StatCard
          icon={Zap} iconColor="text-[var(--expense)]" iconBg="bg-[var(--expense-bg)]"
          label="Top Spend" value={topCat?.name || '—'}
          sub={topCat ? formatCurrency(topCat.value) : 'No data'} delay={100}
        />
        <StatCard
          icon={BarChart3} iconColor="text-[var(--blue)]" iconBg="bg-[var(--blue-bg)]"
          label="Avg. Expense" value={formatCurrency(avgExpense)}
          sub="per transaction" delay={150}
        />
        <StatCard
          icon={ArrowUpRight} iconColor="text-[var(--income)]" iconBg="bg-[var(--income-bg)]"
          label="Net Balance" value={formatCurrency(balance)}
          sub="income minus expenses" delay={200}
        />
      </div>

      {/* Observations */}
      <div
        className="card p-5 opacity-0-init animate-fade-up"
        style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">Smart Observations</h3>
          <span className="pill bg-[var(--accent-muted)] text-[var(--accent)]">AI-powered</span>
        </div>
        <div className="space-y-2.5">
          {observations.map((obs, i) => (
            <ObservationCard key={i} {...obs} delay={300 + i * 60} />
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div
        className="card p-5 opacity-0-init animate-fade-up"
        style={{ animationDelay: '480ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">Category Breakdown</h3>
          <p className="text-[11.5px] text-[var(--text-muted)]">{formatCurrency(totalExpenses)} total</p>
        </div>

        <div className="space-y-3.5">
          {spending.map((cat, i) => {
            const pct = totalExpenses > 0 ? Math.round((cat.value / totalExpenses) * 100) : 0;
            const color = colors[i % colors.length];
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-[var(--text-muted)]">{pct}%</span>
                    <span className="text-[13px] font-semibold text-[var(--text-primary)] tabular-nums w-24 text-right">
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: color,
                      transition: 'width 1s ease-out',
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
