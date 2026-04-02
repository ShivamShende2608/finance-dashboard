'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, ShieldCheck, Eye, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useEffect, useState } from 'react';

export default function Navbar({ onMenuClick, title, subtitle }) {
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useApp();
  const [mounted, setMounted] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-1)]/80 backdrop-blur-xl">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost p-2 gap-0"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-display font-semibold text-[15px] text-[var(--text-primary)] leading-none">{title}</h1>
          {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleOpen(o => !o)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12.5px] font-semibold
              border transition-all duration-200
              ${role === 'Admin'
                ? 'bg-[var(--accent-muted)] border-[var(--accent)]/30 text-[var(--accent)]'
                : 'bg-[var(--surface-2)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
              }
            `}
          >
            {role === 'Admin' ? <ShieldCheck size={13} /> : <Eye size={13} />}
            {role}
            <ChevronDown size={11} className={`transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
          </button>

          {roleOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-40 card p-1 shadow-[var(--shadow-elevated)] z-50 animate-scale-in">
              {['Admin', 'Viewer'].map(r => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false); }}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] font-medium
                    transition-colors duration-150 text-left
                    ${role === r ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'}
                  `}
                >
                  {r === 'Admin' ? <ShieldCheck size={13} /> : <Eye size={13} />}
                  {r}
                  {r === 'Admin' && <span className="ml-auto text-[10px] text-[var(--text-muted)]">Full access</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="relative w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-all duration-200"
          >
            <Sun size={15} className={`absolute transition-all duration-300 ${theme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
            <Moon size={15} className={`absolute transition-all duration-300 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
          </button>
        )}
      </div>
    </header>
  );
}
