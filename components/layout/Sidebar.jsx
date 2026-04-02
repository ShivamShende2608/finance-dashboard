'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, X, Hexagon } from 'lucide-react';

const nav = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, desc: 'Overview & charts' },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight,  desc: 'All entries' },
  { href: '/insights',     label: 'Insights',     icon: Lightbulb,       desc: 'Analytics' },
];

export default function Sidebar({ open, onClose }) {
  const path = usePathname();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />}

      <aside className={`
        fixed top-0 left-0 h-full z-30
        w-[260px] flex flex-col
        sidebar-mesh
        border-r border-[var(--border-subtle)]
        transform transition-transform duration-300 ease-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-[var(--accent)] opacity-20 blur-md" />
              <div className="relative w-9 h-9 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg" style={{ boxShadow: '0 4px 14px var(--accent-glow)' }}>
                <Hexagon size={18} className="text-white fill-white/20" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-[15px] text-[var(--text-primary)] leading-none">FinFlow</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium tracking-wider uppercase">Finance</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-3)] transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Nav label */}
        <p className="px-5 mb-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">Navigation</p>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-0.5">
          {nav.map(({ href, label, icon: Icon, desc }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 overflow-hidden
                  ${active
                    ? 'bg-[var(--accent-muted)]'
                    : 'hover:bg-[var(--surface-3)]'
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--accent)]" />
                )}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  transition-colors duration-200
                  ${active
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]'
                    : 'bg-[var(--surface-3)] text-[var(--text-secondary)] group-hover:bg-[var(--surface-0)] group-hover:text-[var(--text-primary)]'
                  }
                `}>
                  <Icon size={15} strokeWidth={active ? 2 : 1.75} />
                </div>
                <div>
                  <p className={`text-[13px] font-semibold leading-none ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{desc}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom card */}
        <div className="m-4 p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="accent-dot" />
            <span className="text-[11px] font-semibold text-[var(--text-primary)]">System Online</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">All services running normally. Data synced.</p>
        </div>
      </aside>
    </>
  );
}
