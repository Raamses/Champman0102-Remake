import React from 'react';
import { motion } from 'motion/react';
import { useGameData } from '../lib/useGameData';
import { useAuth } from '../lib/AuthProvider';
import { ShieldAlert, TrendingUp, Users, Wallet, Calendar, Trophy, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatBlockProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  subtext?: string;
}

function StatBlock({ label, value, icon: Icon, subtext }: StatBlockProps) {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-sm p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-12 h-12" />
      </div>
      <p className="text-[9px] text-brand-muted uppercase tracking-widest font-bold mb-2">{label}</p>
      <h4 className="text-2xl font-bold tracking-tight text-brand-text">{value}</h4>
      {subtext && <p className="text-[9px] text-brand-primary uppercase tracking-widest mt-1 font-bold">{subtext}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { club, players } = useGameData(profile?.clubId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Club Overview Header */}
      <div className="bg-brand-surface border border-brand-border rounded-sm p-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${club?.colors[0] || '#000'}, transparent)` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div 
            className="w-20 h-20 rounded-sm flex items-center justify-center shadow-2xl border border-white/5"
            style={{ backgroundColor: club?.colors[0] }}
          >
            <ShieldAlert className="w-10 h-10" style={{ color: club?.colors[1] }} />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 text-brand-text">
              {club?.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <span className="px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded-sm text-[9px] text-brand-primary font-black uppercase tracking-widest">
                 Level 1 Manager
               </span>
               <span className="text-brand-muted text-[9px] uppercase tracking-widest font-bold">
                 Founded 2026 • 0 Trophies
               </span>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/5 border border-white/5 rounded-sm p-4 text-center min-w-[120px]">
                <p className="text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-1">Wage Budget</p>
                <p className="text-lg font-bold text-brand-primary font-mono tracking-tighter">€{(club?.budget || 0) / 1000000}M</p>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-sm p-4 text-center min-w-[120px]">
                <p className="text-[9px] text-brand-muted uppercase font-bold tracking-widest mb-1">Global Rank</p>
                <p className="text-lg font-bold font-mono tracking-tighter italic">#24</p>
             </div>
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBlock label="Squad Size" value={players.length} icon={Users} subtext="Optimal Balance" />
        <StatBlock label="Avg Rating" value={78.4} icon={Zap} subtext="+1.2 Improvement" />
        <StatBlock label="Win Rate" value="64%" icon={Trophy} subtext="Projected: Top 4" />
        <StatBlock label="Reputation" value={club?.reputation || 0} icon={TrendingUp} subtext="Rising Powerhouse" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column: Recent Matches */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-brand-muted">
                <Calendar className="w-4 h-4 text-brand-primary" />
                Recent Competitive Results
              </h3>
              <button className="text-[9px] text-brand-muted uppercase font-bold hover:text-brand-text transition-colors border-b border-transparent hover:border-brand-primary">Full Schedule</button>
           </div>
           <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-brand-surface border border-brand-border rounded-sm p-4 flex items-center justify-between group hover:bg-white/[0.02] transition-colors cursor-pointer border-l-2 border-l-transparent hover:border-l-brand-primary">
                  <div className="flex items-center gap-6 flex-1">
                    <span className="text-[10px] text-brand-muted font-mono uppercase tracking-widest w-12 text-center">15 JUL</span>
                    <div className="flex items-center justify-end gap-3 flex-1">
                      <span className="font-bold uppercase tracking-tighter text-sm">{club?.name}</span>
                      <ShieldAlert className="w-4 h-4 opacity-40 shadow-glow" style={{ color: club?.colors[0] }} />
                    </div>
                    <div className="flex items-center gap-2 min-w-[70px] justify-center bg-black/40 px-3 py-1 rounded-sm border border-white/5 font-mono">
                      <span className="text-brand-primary font-bold">2</span>
                      <span className="text-brand-muted/30">-</span>
                      <span className="font-bold">1</span>
                    </div>
                    <div className="flex items-center gap-3 flex-1 text-brand-muted">
                      <ShieldAlert className="w-4 h-4 text-blue-900 opacity-40" />
                      <span className="uppercase tracking-tighter text-sm group-hover:text-brand-text transition-colors italic">Paris Blue</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right Column: Development Report */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-brand-muted">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
                Development Report
              </h3>
           </div>
           <div className="bg-brand-surface border border-brand-border rounded-sm divide-y divide-brand-border overflow-hidden">
              {players
                .sort((a, b) => (b.potential - b.rating) - (a.potential - a.rating))
                .slice(0, 5)
                .map(player => (
                <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-sm bg-black/40 flex items-center justify-center text-[11px] font-bold border border-white/5 text-brand-primary">
                      {Math.floor(player.rating)}
                    </div>
                    {player.developmentTrend === 'rising' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full border-2 border-brand-bg animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold uppercase tracking-tighter truncate text-brand-text group-hover:text-brand-primary transition-colors">{player.name}</p>
                    <div className="flex items-center gap-2">
                       <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">{player.position}</p>
                       <span className="text-[8px] bg-brand-primary/10 text-brand-primary px-1 rounded-sm font-black whitespace-nowrap">
                         POT {Math.floor(player.potential)}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <p className="text-[8px] text-brand-muted uppercase font-bold text-center tracking-[0.2em] mt-4">
             AI Scouter: {players.filter(p => p.developmentTrend === 'rising').length} Players showing high growth
           </p>
        </div>
      </div>
    </div>
  );
}
