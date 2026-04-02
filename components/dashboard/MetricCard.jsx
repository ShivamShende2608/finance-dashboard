'use client';
import { useCountUp } from '../../hooks/useCountUp';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({ title, amount, icon: Icon, type, badge, delay = 0 }) {
  const animated = useCountUp(amount, 1400, delay);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(animated);

  const styles = {
    income:  { iconBg: 'bg-[var(--income-bg)]',  iconColor: 'text-[var(--income)]',  ring: '0 0 0 1px rgba(34,197,94,0.25)' },
    expense: { iconBg: 'bg-[var(--expense-bg)]', iconColor: 'text-[var(--expense)]', ring: '0 0 0 1px rgba(248,113,113,0.25)' },
    balance: { iconBg: 'bg-[var(--blue-bg)]',    iconColor: 'text-[var(--blue)]',    ring: '0 0 0 1px rgba(59,142,255,0.25)' },
  };
  const s = styles[type] || styles.balance;

  return (
    <div
      className="card p-5 opacity-0-init animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-[12.5px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0`}
             style={{ boxShadow: s.ring }}>
          <Icon size={16} className={s.iconColor} strokeWidth={2} />
        </div>
      </div>

      {/* Amount */}
      <p className="font-display font-bold text-[26px] text-[var(--text-primary)] leading-none tabular-nums">
        {formatted}
      </p>

      {/* Badge */}
      {badge && (
        <div className="mt-3 flex items-center gap-1.5">
          {badge.positive !== undefined && (
            badge.positive
              ? <ArrowUpRight size={12} className="text-[var(--income)]" />
              : <ArrowDownRight size={12} className="text-[var(--expense)]" />
          )}
          <span className="text-[11.5px] text-[var(--text-muted)]">{badge.label}</span>
        </div>
      )}
    </div>
  );
}
