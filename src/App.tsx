/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ProfileProvider, useProfile } from './lib/ProfileProvider';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Squad from './components/Squad';
import Transfers from './components/Transfers';
import ClubSelector from './components/ClubSelector';
import { motion, AnimatePresence } from 'motion/react';

function GameContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile, updateProfile } = useProfile();
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


export default function App() {
  return (
    <ProfileProvider>
      <GameContent />
    </ProfileProvider>
  );
}

