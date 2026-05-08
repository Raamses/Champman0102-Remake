import React, { useState } from 'react';
import { LayoutDashboard, Users, ShieldAlert, Globe, Trophy, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
  key?: string;
}

function SidebarItem({ icon: Icon, label, active, isCollapsed, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center rounded transition-all duration-200 group relative overflow-hidden h-10",
        isCollapsed ? "justify-center px-0" : "gap-3 px-3 py-2",
        active 
          ? "bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary" 
          : "text-brand-muted hover:text-brand-text hover:bg-white/[0.03] border-l-2 border-transparent"
      )}
      title={isCollapsed ? label : undefined}
    >
      <Icon className={cn("w-4 h-4 shrink-0", active ? "text-brand-primary" : "group-hover:scale-110 transition-transform")} />
      {!isCollapsed && (
        <>
          <span className="font-bold tracking-widest uppercase text-[10px] truncate">{label}</span>
          {active && (
            <div className="ml-auto w-1 h-1 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,1)]" />
          )}
        </>
      )}
    </button>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  const { profile, logout, updateProfile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'tactics', label: 'Tactics', icon: ShieldAlert },
    { id: 'transfers', label: 'Transfers', icon: Globe },
    { id: 'league', label: 'League', icon: Trophy },
  ];

  const [showResignConfirm, setShowResignConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg flex text-brand-text relative font-sans overflow-hidden">
      <div className="fixed inset-0 technical-grid opacity-10 pointer-events-none" />

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {showResignConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-brand-surface border border-brand-border p-8 rounded-sm max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
              <ShieldAlert className="w-12 h-12 text-brand-primary mx-auto mb-6" />
              <h3 className="text-xl font-black uppercase tracking-tighter italic mb-4">Operational Resignation</h3>
              <p className="text-brand-muted text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                You are about to terminate your tenure at <span className="text-brand-text">{profile?.clubId}</span>. This action will archive current squad data and fiscal records.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowResignConfirm(false)}
                  className="px-6 py-3 border border-brand-border text-brand-muted font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={() => {
                    updateProfile({ clubId: "" });
                    setShowResignConfirm(false);
                  }}
                  className="px-6 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex bg-brand-surface/50 border-r border-brand-border flex-col backdrop-blur-md z-20 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}>
        <div className="p-4 border-b border-brand-border h-16 flex items-center justify-between bg-brand-surface">
          <div className={cn("flex items-center gap-3 transition-opacity duration-300", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100")}>
            <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center font-black text-black text-xl italic shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              M
            </div>
            <h1 className="text-sm font-bold tracking-tight uppercase">Manager <span className="text-brand-primary">ROYALE</span></h1>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-sm text-brand-muted hover:text-brand-primary transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-4 px-2">Navigation</h2>}
          <nav className="space-y-1">
            {navigation.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                active={activeTab === item.id}
                onClick={() => onTabChange(item.id)}
              />
            ))}
          </nav>

          {!isCollapsed && (
            <>
              <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-8 mb-4 px-2">Online Status</h2>
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3 p-2 bg-brand-surface/40 rounded border border-brand-border/50">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-bold truncate">Server: Europe-West</p>
                    <p className="text-[9px] text-brand-muted">Latency: 24ms</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t border-brand-border bg-brand-surface/30">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-brand-border transition-all">
            <div className="w-8 h-8 rounded-full bg-brand-surface border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs shrink-0">
              {profile?.displayName?.charAt(0)}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">{profile?.displayName}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowResignConfirm(true)}
                    className="text-[9px] text-brand-primary uppercase font-black hover:text-brand-primary-hover transition-colors"
                  >
                    Resign
                  </button>
                  <span className="text-brand-border text-[9px]">•</span>
                  <button 
                    onClick={logout}
                    className="text-[9px] text-red-500 uppercase font-black hover:text-red-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        {/* Header / Top Bar */}
        <header className="h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-brand-muted hover:text-brand-text"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-text/90">
              {navigation.find(n => n.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] uppercase text-brand-muted font-bold tracking-widest leading-none mb-1">In-Game Date</p>
              <p className="text-sm font-mono text-brand-text">TUE 14 AUG 2026</p>
            </div>
            <button className="bg-brand-primary hover:bg-brand-primary-hover text-black px-6 py-2 rounded-sm font-bold uppercase text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              Continue <span className="text-base leading-none">→</span>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto bg-brand-bg relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-6 lg:p-10"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer / Status Bar */}
        <footer className="h-8 bg-black border-t border-brand-border flex items-center justify-between px-6 text-[9px] text-brand-muted font-bold shrink-0 uppercase tracking-tight">
          <div className="flex gap-4">
            <span>v2.6.1-ROYALE</span>
            <span className="text-brand-border">|</span>
            <span className="text-brand-primary/60">Cloud Sync Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
            <span className="text-brand-text/50">Multiplayer Lobby: London-Alpha</span>
          </div>
        </footer>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-brand-bg border-r border-brand-border z-40 md:hidden p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <ShieldAlert className="w-8 h-8 text-brand-primary" />
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    active={activeTab === item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
