import React from 'react';
import { Database, ShieldAlert, Users, Globe, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAVIGATION: NavItem[] = [
  { id: 'database', label: 'Database', icon: Database },
  { id: 'squad', label: 'Squad', icon: Users },
  { id: 'tactics', label: 'Tactics', icon: ShieldAlert },
  { id: 'transfers', label: 'Transfers', icon: Globe },
  { id: 'league', label: 'League', icon: Trophy },
];

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-text font-sans">
      <aside className="hidden md:flex w-56 shrink-0 bg-brand-surface border-r border-brand-border flex-col">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-brand-border">
          <div className="w-7 h-7 rounded bg-brand-primary flex items-center justify-center font-black text-black text-sm">
            CM
          </div>
          <span className="text-sm font-bold uppercase tracking-wide">01/02 Remake</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAVIGATION.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-bold uppercase tracking-wide transition-colors',
                activeTab === id
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-brand-muted hover:text-brand-text hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center px-6 border-b border-brand-border shrink-0">
          <h1 className="text-sm font-bold uppercase tracking-widest text-brand-text/90">
            {NAVIGATION.find((n) => n.id === activeTab)?.label ?? 'Championship Manager 01/02 Remake'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
