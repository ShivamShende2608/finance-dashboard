'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { generateBalanceTrend } from '../../lib/mockData';
import { useTheme } from 'next-themes';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payload[0].value);
  return (
    <div className="card px-3.5 py-2.5 shadow-[var(--shadow-elevated)]">
      <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{label}</p>
      <p className="font-display font-bold text-[15px] text-[var(--accent)]">{val}</p>
    </div>
  );
};

const PERIODS = ['7D','14D','30D'];

export default function BalanceTrendChart() {
  const { transactions } = useApp();
  const { theme } = useTheme();
  const [period, setPeriod] = useState('30D');

  const allData = generateBalanceTrend(transactions);
  const sliceMap = { '7D': 7, '14D': 14, '30D': 30 };
  const data = allData.slice(-sliceMap[period]);

  const isDark = theme === 'dark';
  const gridColor   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const axisColor   = isDark ? '#55556A' : '#9E9EAD';
  const accentColor = isDark ? '#3B8EFF' : '#1D6FEB';
  const gradStop    = isDark ? 'rgba(59,142,255,0.18)' : 'rgba(29,111,235,0.12)';

  return (
    <div className="card p-5 opacity-0-init animate-fade-up stagger-4" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-[15px] text-[var(--text-primary)]">Balance Trend</h3>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Portfolio performance over time</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--surface-2)] rounded-lg p-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-all duration-150 ${
                period === p
                  ? 'bg-[var(--surface-1)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >{p}</button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={accentColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10.5, fill: axisColor, fontFamily: 'Plus Jakarta Sans' }}
            tickLine={false} axisLine={false}
            tickFormatter={(v, i) => i % Math.ceil(data.length / 6) === 0 ? v : ''}
          />
          <YAxis
            tick={{ fontSize: 10.5, fill: axisColor, fontFamily: 'Plus Jakarta Sans' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: accentColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotoneX"
            dataKey="balance"
            stroke={accentColor}
            strokeWidth={2}
            fill="url(#trendGrad)"
            dot={false}
            activeDot={{ r: 4, fill: accentColor, strokeWidth: 2, stroke: isDark ? '#0E0E14' : '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
