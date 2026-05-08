/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthProvider';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Squad from './components/Squad';
import Transfers from './components/Transfers';
import ClubSelector from './components/ClubSelector';
import { LogIn, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function GameContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, updateProfile } = useAuth();
  const [tempName, setTempName] = useState(profile?.displayName || '');
  const [isSettingName, setIsSettingName] = useState(!profile?.displayName || profile?.displayName === 'Manager');

  if (!profile?.clubId || isSettingName) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 lg:p-12 technical-grid overflow-hidden">
        <div className="fixed inset-0 bg-brand-primary/[0.02] pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-7xl w-full bg-brand-surface/40 backdrop-blur-3xl border border-brand-border rounded-sm p-8 lg:p-16 text-center relative overflow-hidden shadow-2xl z-10"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[1px] px-4">
             <div className="w-full h-full bg-gradient-to-r from-transparent via-brand-primary to-transparent shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
          </div>
          
          <AnimatePresence mode="wait">
            {isSettingName ? (
              <motion.div
                key="name-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary mb-8 text-[9px] font-black uppercase tracking-[0.3em]">
                  Phase 1.0 // Identity Verification
                </div>
                <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6 text-brand-text italic leading-none">
                  Assign <span className="text-brand-primary">Command</span> Alias
                </h2>
                <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest mb-12 opacity-60">
                  Register your managerial credentials with the central simulation hub.
                </p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter Alias..."
                    className="w-full bg-black/40 border border-brand-border rounded-sm p-4 text-center font-black uppercase tracking-[0.2em] outline-none focus:border-brand-primary transition-all text-sm mb-6"
                  />
                  <button
                    onClick={async () => {
                      if (tempName.trim()) {
                        await updateProfile({ displayName: tempName });
                        setIsSettingName(false);
                      }
                    }}
                    disabled={!tempName.trim()}
                    className="w-full bg-brand-primary text-black font-black uppercase tracking-widest py-4 rounded-sm hover:bg-brand-primary-hover disabled:opacity-50 transition-all text-xs shadow-glow"
                  >
                    Confirm Credentials
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="club-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Credentials Verified // Phase 1.1 Active</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-4 leading-none text-brand-text italic drop-shadow-2xl">
                    Select Your <span className="text-brand-primary underline decoration-4 underline-offset-8">Tenure</span>
                  </h2>
                  <p className="text-brand-muted max-w-2xl mx-auto text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] leading-loose opacity-70 mb-6">
                    Operational vacancies detected. Select an infrastructure choice to initiate your simulation cycle. 
                  </p>
                  <button 
                    onClick={() => setIsSettingName(true)}
                    className="text-[9px] text-brand-primary uppercase font-black hover:underline tracking-widest"
                  >
                    ← Re-verify Identity Alias
                  </button>
                </div>
                
                <div className="relative">
                  <div className="absolute -inset-4 bg-brand-primary/5 blur-3xl opacity-20 pointer-events-none" />
                  <ClubSelector />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-[9px] text-brand-muted font-bold uppercase tracking-[0.4em] px-8 py-3 border border-brand-border bg-black/20 rounded-sm inline-block">
              Awaiting Simulation Initialization Protocol
            </p>
            <div className="flex gap-8 opacity-40">
              {['Data-Core: Online', 'Physics-Engine: Stabilized', 'Global-Markets: Syncing'].map((s, i) => (
                <span key={i} className="text-[7px] font-black uppercase tracking-widest text-brand-muted">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'squad': return <Squad />;
      case 'transfers': return <Transfers />;
      default: return (
        <div className="flex-1 flex flex-col items-center justify-center py-40 opacity-20 gap-8">
           <div className="w-16 h-16 rounded-sm border-2 border-dashed border-brand-primary animate-[spin_10s_linear_infinite]" />
           <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary">Module Under Construction</p>
        </div>
      );
    }
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppShell>
  );
}


function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center technical-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl w-full px-6 flex flex-col items-center text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-12"
        >
          <div className="w-20 h-20 bg-brand-primary rounded-sm flex items-center justify-center mb-8 mx-auto -rotate-6 shadow-[0_0_40px_rgba(16,185,129,0.35)] border border-white/20">
            <ShieldAlert className="w-10 h-10 text-black" />
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 leading-none text-brand-text">
            MANAGER<br /><span className="text-brand-primary italic">ROYALE</span>
          </h1>
          
          <p className="text-sm md:text-base text-brand-muted mb-12 max-w-xl mx-auto font-bold uppercase tracking-[0.2em] leading-relaxed px-4">
            Legacy Tactical Simulation Meets Modern Competitive Networking.
          </p>

          <button
            onClick={signIn}
            className="group relative flex items-center gap-6 bg-brand-primary text-black px-12 py-5 rounded-sm font-black uppercase tracking-widest hover:bg-brand-primary-hover active:scale-95 transition-all shadow-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <LogIn className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Initiate Command</span>
            <div className="absolute -inset-1 rounded-sm border border-brand-primary/50 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
          </button>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full py-12 border-t border-brand-border/30">
          {[
            { label: 'Active Sessions', val: '22,482' },
            { label: 'Global Servers', val: 'EU • NA • ASIA' },
            { label: 'Data Accuracy', val: '99.9%' },
            { label: 'Tactics Depth', val: 'LEGACY+' }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <p className="text-brand-primary text-xl font-black font-mono tracking-tighter mb-1 group-hover:scale-110 transition-transform">{stat.val}</p>
              <p className="text-[9px] text-brand-muted uppercase font-bold tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative text */}
      <div className="absolute bottom-10 left-10 text-[9px] text-brand-muted font-bold uppercase tracking-widest opacity-20 hidden lg:block">
        AUTHENTICATION_REQUIRED // SYSTEM_READY
      </div>
    </div>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center technical-grid">
         <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-border rounded-sm animate-[spin_4s_linear_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center font-black text-[9px] text-brand-primary animate-pulse">
               M
            </div>
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold text-brand-muted uppercase tracking-[0.3em] whitespace-nowrap">
              Loading Session
            </p>
         </div>
      </div>
    );
  }

  return user ? <GameContent /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

