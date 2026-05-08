import React from 'react';
import { motion } from 'motion/react';
import { X, ShieldAlert, ChevronLeft } from 'lucide-react';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface ComparisonViewProps {
  players: Player[];
  onClose: () => void;
}

export default function ComparisonView({ players, onClose }: ComparisonViewProps) {
  const attributeGroups = [
    {
      title: 'Technical Dominance',
      attrs: [
        { key: 'crossing', label: 'Crossing' },
        { key: 'dribbling', label: 'Dribbling' },
        { key: 'finishing', label: 'Finishing' },
        { key: 'freeKicks', label: 'Free Kicks' },
        { key: 'heading', label: 'Heading' },
        { key: 'longShots', label: 'Long Shots' },
        { key: 'marking', label: 'Marking' },
        { key: 'passing', label: 'Passing' },
        { key: 'penalties', label: 'Penalties' },
        { key: 'tackling', label: 'Tackling' },
        { key: 'technique', label: 'Technique' },
      ]
    },
    {
      title: 'Mental Fortitude',
      attrs: [
        { key: 'aggression', label: 'Aggression' },
        { key: 'anticipation', label: 'Anticipation' },
        { key: 'bravery', label: 'Bravery' },
        { key: 'composure', label: 'Composure' },
        { key: 'concentration', label: 'Concentration' },
        { key: 'creativity', label: 'Creativity' },
        { key: 'decisions', label: 'Decisions' },
        { key: 'determination', label: 'Determination' },
        { key: 'flair', label: 'Flair' },
        { key: 'influence', label: 'Influence' },
        { key: 'offTheBall', label: 'Off the Ball' },
        { key: 'positioning', label: 'Positioning' },
        { key: 'teamwork', label: 'Teamwork' },
        { key: 'workRate', label: 'Work Rate' },
      ]
    },
    {
      title: 'Physical Prowess',
      attrs: [
        { key: 'acceleration', label: 'Acceleration' },
        { key: 'agility', label: 'Agility' },
        { key: 'balance', label: 'Balance' },
        { key: 'jumping', label: 'Jumping' },
        { key: 'pace', label: 'Pace' },
        { key: 'stamina', label: 'Stamina' },
        { key: 'strength', label: 'Strength' },
      ]
    }
  ];

  if (players.length < 2) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-brand-surface/20 backdrop-blur-3xl border border-brand-border rounded-sm shadow-2xl overflow-hidden"
    >
      {/* Header Section - Now smaller and fixed height */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-brand-border shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-brand-text truncate">Scouting Analytics // Session Sync</h2>
        </div>
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all rounded-sm group"
        >
          <ChevronLeft className="w-3 h-3 text-brand-muted group-hover:text-brand-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted group-hover:text-brand-primary">Back</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Sticky Player Profiles Hero */}
        <div className="sticky top-0 z-30 grid grid-cols-2 divide-x divide-brand-border bg-brand-surface/90 backdrop-blur-md border-b border-brand-border shadow-xl">
          {players.slice(0, 2).map((player, idx) => (
            <div key={player.id} className={cn(
              "p-6 relative overflow-hidden group",
              idx === 0 ? "bg-gradient-to-br from-brand-primary/[0.03] to-transparent" : "bg-gradient-to-bl from-brand-primary/[0.03] to-transparent"
            )}>
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-sm">
                      {player.position}
                    </span>
                    <span className="text-[8px] font-bold text-brand-muted/60 uppercase tracking-widest truncate">
                      {player.nationality}
                    </span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-brand-text group-hover:text-brand-primary transition-colors truncate">
                    {player.name}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-3xl font-black italic text-brand-text leading-none">
                    {Math.floor(player.rating)}
                  </div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary mt-1">OVR</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Stats Comparison */}
        <div className="p-8 lg:p-12 space-y-16 max-w-7xl mx-auto">
          {/* Quick Metrics Dashboard */}
          <div className="grid grid-cols-2 gap-8 divide-x divide-brand-border/30">
            {players.slice(0, 2).map((player) => (
              <div key={player.id + '-metrics'} className="grid grid-cols-3 gap-4 px-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted">Value</p>
                  <p className="text-sm font-mono font-bold text-brand-text">€{(player.value / 1000000).toFixed(1)}M</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted">Age</p>
                  <p className="text-sm font-mono font-bold text-brand-text">{player.age}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-brand-muted">Potential</p>
                  <p className="text-sm font-mono font-bold text-brand-primary">{Math.floor(player.potential)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Attributes Sections */}
          <div className="space-y-24">
             {attributeGroups.map((group) => (
               <div key={group.title} className="space-y-10">
                  <div className="flex items-center gap-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.4em] text-brand-primary whitespace-nowrap">{group.title}</h4>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-brand-primary/30 via-brand-primary/10 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                    {group.attrs.map(attr => {
                      const stats1 = players[0].stats;
                      const stats2 = players[1].stats;
                      const key = attr.key as keyof Player['stats'];
                      const val1 = stats1[key];
                      const val2 = stats2[key];
                      const diff = val1 - val2;
                      
                      return (
                        <div key={attr.key} className="space-y-3 group/stat bg-white/[0.01] hover:bg-white/[0.03] p-3 rounded transition-all">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                             <span className={cn(
                               "transition-colors tabular-nums",
                               diff > 0 ? "text-brand-primary" : "text-brand-muted/70 group-hover/stat:text-brand-muted"
                             )}>{Math.floor(val1)}</span>
                             <span className="text-white/40 group-hover/stat:text-white transition-colors">{attr.label}</span>
                             <span className={cn(
                               "transition-colors tabular-nums",
                               diff < 0 ? "text-brand-primary" : "text-brand-muted/70 group-hover/stat:text-brand-muted"
                             )}>{Math.floor(val2)}</span>
                          </div>
                          
                          <div className="h-2 flex gap-1 items-center">
                            <div className="flex-1 h-full bg-white/5 rounded-full overflow-hidden flex justify-end">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(val1 / 100) * 100}%` }}
                                 transition={{ duration: 0.8, ease: "easeOut" }}
                                 className={cn(
                                   "h-full transition-all duration-500",
                                   diff > 0 ? "bg-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/10"
                                 )} 
                               />
                            </div>
                            <div className="flex-1 h-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(val2 / 100) * 100}%` }}
                                 transition={{ duration: 0.8, ease: "easeOut" }}
                                 className={cn(
                                   "h-full transition-all duration-500",
                                   diff < 0 ? "bg-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-white/10"
                                 )} 
                               />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
             ))}
          </div>

          <div className="pt-20 pb-10 border-t border-brand-border/30 text-center">
             <p className="text-[9px] font-black uppercase tracking-[0.5em] text-brand-muted italic opacity-40">End of Analytical Dossier // High Integrity Output</p>
          </div>
        </div>
      </div>


      {/* Footer Branding */}
      <div className="p-4 bg-black/40 border-t border-brand-border flex items-center justify-center gap-12 shrink-0">
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
           <span className="text-[8px] font-black uppercase tracking-widest text-brand-muted">Performance Lead</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-white/10" />
           <span className="text-[8px] font-black uppercase tracking-widest text-brand-muted">Benchmark Value</span>
         </div>
         <div className="flex items-center gap-2 opacity-30">
           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-brand-muted italic">Neural Engine Verified</span>
         </div>
      </div>
    </motion.div>
  );
}
