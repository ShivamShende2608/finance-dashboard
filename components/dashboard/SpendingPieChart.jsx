'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { getSpendingByCategory, formatCurrency, CHART_COLORS, CHART_COLORS_LIGHT } from '../../lib/mockData';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3.5 py-2.5 shadow-[var(--shadow-elevated)]">
      <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{payload[0].name}</p>
      <p className="font-display font-bold text-[15px] text-[var(--text-primary)]">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function SpendingPieChart() {
  const { transactions, totalExpenses } = useApp();
  const { theme } = useTheme();
  const [active, setActive] = useState(null);

  const data = getSpendingByCategory(transactions);
  const colors = theme === 'dark' ? CHART_COLORS : CHART_COLORS_LIGHT;

  const activeItem = active !== null ? data[active] : null;

  return (
    <div className="card p-5 opacity-0-init animate-fade-up stagger-5" style={{ animationFillMode: 'forwards' }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">Spending Breakdown</h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">By category</p>
      </div>

      {/* Chart with more top padding to prevent clipping */}
      <div className="relative" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 16, right: 16, bottom: 8, left: 16 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={colors[i % colors.length]}
                  opacity={active === null || active === i ? 1 : 0.35}
                  style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {activeItem ? (
            <>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">{activeItem.name}</p>
              <p className="font-display font-bold text-[14px] text-[var(--text-primary)]">{formatCurrency(activeItem.value)}</p>
            </>
          ) : (
            <>
              <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total</p>
              <p className="font-display font-bold text-[14px] text-[var(--text-primary)]">{formatCurrency(totalExpenses)}</p>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
        {data.slice(0, 6).map((item, i) => {
          const pct = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center gap-2 cursor-default"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
              <span className="text-[11.5px] text-[var(--text-secondary)] flex-1 truncate">{item.name}</span>
              <span className="text-[11px] font-semibold text-[var(--text-muted)]">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
