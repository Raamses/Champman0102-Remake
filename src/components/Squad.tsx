import React, { useState } from 'react';
import { useAuth } from '../lib/AuthProvider';
import { useGameData } from '../lib/useGameData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import ComparisonView from './ComparisonView';

export default function Squad() {
  const { profile } = useAuth();
  const { players } = useGameData(profile?.clubId);

  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlayers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const comparedPlayers = players.filter(p => selectedPlayers.includes(p.id));

  if (showComparison) {
    return (
      <div className="absolute inset-0 z-[60] bg-brand-bg">
        <ComparisonView 
          players={comparedPlayers} 
          onClose={() => setShowComparison(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-text italic">First Team Squad</h2>
          <p className="text-brand-muted font-bold text-[9px] uppercase tracking-widest mt-1">Season 2026/27 • Performance Analytics Active</p>
        </div>
        <div className="flex items-center gap-4">
           {selectedPlayers.length > 0 && (
             <motion.button 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               onClick={() => setShowComparison(true)}
               className="bg-brand-surface/50 border border-brand-primary text-brand-primary px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary/10 transition-colors shadow-glow"
             >
               Compare ({selectedPlayers.length})
             </motion.button>
           )}
           <button className="bg-brand-surface border border-brand-border px-4 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-white/[0.05] transition-colors">Filters</button>
           <button className="bg-brand-primary text-black px-4 py-2 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-brand-primary-hover transition-colors shadow-lg">Registration</button>
        </div>
      </div>

      <div className="bg-brand-surface border border-brand-border rounded-sm overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-surface border-b border-brand-border">
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted">Selection</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted">Name</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted">Nat</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted">Details</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted text-center">Trend</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted text-center">Potential</th>
                <th className="px-4 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted text-center">Fitness</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-bold text-brand-muted text-right">Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {players.map((player, idx) => (
                <React.Fragment key={player.id}>
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                    className={cn(
                      "hover:bg-white/[0.02] transition-colors group cursor-pointer h-14",
                      expandedPlayer === player.id && "bg-white/[0.03] border-l-2 border-l-brand-primary"
                    )}
                  >
                    <td className="px-6">
                      <div 
                        onClick={(e) => toggleSelect(player.id, e)}
                        className={cn(
                          "w-4 h-4 border rounded-sm transition-all flex items-center justify-center",
                          selectedPlayers.includes(player.id) 
                            ? "bg-brand-primary border-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                            : "bg-black/40 border-brand-border group-hover:border-brand-primary/50"
                        )}
                      >
                        {selectedPlayers.includes(player.id) ? (
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        ) : (
                          idx < 11 && <div className="w-1.5 h-1.5 bg-brand-primary/20 rounded-full" />
                        )}
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight text-brand-text group-hover:text-brand-primary transition-colors">{player.name}</span>
                        <span className="text-[9px] text-brand-muted font-bold uppercase tracking-widest italic">{player.position}</span>
                      </div>
                    </td>
                    <td className="px-4">
                      <span className="text-[10px] font-mono font-bold text-brand-muted">{player.nationality.substring(0, 3).toUpperCase()}</span>
                    </td>
                    <td className="px-4">
                       <span className="text-[10px] font-mono text-brand-muted">{player.age}y • Rank {Math.floor(player.rating)}</span>
                    </td>
                    <td className="px-4">
                      <div className="flex justify-center">
                        {player.developmentTrend === 'rising' ? (
                          <TrendingUp className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                        ) : player.developmentTrend === 'declining' ? (
                          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 text-brand-muted/40" />
                        )}
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-brand-primary/50" />
                          <span className="text-[10px] font-bold text-brand-text">{Math.floor(player.potential)}</span>
                        </div>
                        <div className="w-12 h-0.5 bg-brand-border rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              player.developmentTrend === 'rising' ? "bg-brand-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-brand-muted/40"
                            )} 
                            style={{ width: `${(player.potential / player.maxPotential) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "text-[10px] font-bold",
                          player.condition > 90 ? "text-brand-primary" : "text-yellow-500"
                        )}>{player.condition}%</span>
                        <div className="w-10 h-1 bg-brand-border rounded-full overflow-hidden">
                          <div className="h-full bg-brand-primary/40" style={{ width: `${player.condition}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 text-right">
                      <span className="font-mono text-xs font-bold text-brand-text">
                        €{(player.value / 1000000).toFixed(1)}M
                      </span>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedPlayer === player.id && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-black/40"
                      >
                        <td colSpan={8} className="px-6 py-8 bg-black/60 ring-1 ring-inset ring-brand-border/30">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                             {[
                               {
                                 title: 'Technical',
                                 attrs: [
                                   { label: 'Crossing', key: 'crossing' },
                                   { label: 'Dribbling', key: 'dribbling' },
                                   { label: 'Finishing', key: 'finishing' },
                                   { label: 'Free Kicks', key: 'freeKicks' },
                                   { label: 'Heading', key: 'heading' },
                                   { label: 'Long Shots', key: 'longShots' },
                                   { label: 'Marking', key: 'marking' },
                                   { label: 'Passing', key: 'passing' },
                                   { label: 'Penalties', key: 'penalties' },
                                   { label: 'Tackling', key: 'tackling' },
                                   { label: 'Technique', key: 'technique' },
                                 ]
                               },
                               {
                                 title: 'Mental',
                                 attrs: [
                                   { label: 'Aggression', key: 'aggression' },
                                   { label: 'Anticipation', key: 'anticipation' },
                                   { label: 'Bravery', key: 'bravery' },
                                   { label: 'Composure', key: 'composure' },
                                   { label: 'Concentration', key: 'concentration' },
                                   { label: 'Creativity', key: 'creativity' },
                                   { label: 'Decisions', key: 'decisions' },
                                   { label: 'Determination', key: 'determination' },
                                   { label: 'Flair', key: 'flair' },
                                   { label: 'Influence', key: 'influence' },
                                   { label: 'Off the Ball', key: 'offTheBall' },
                                   { label: 'Positioning', key: 'positioning' },
                                   { label: 'Teamwork', key: 'teamwork' },
                                   { label: 'Work Rate', key: 'workRate' },
                                 ]
                               },
                               {
                                 title: 'Physical',
                                 attrs: [
                                   { label: 'Acceleration', key: 'acceleration' },
                                   { label: 'Agility', key: 'agility' },
                                   { label: 'Balance', key: 'balance' },
                                   { label: 'Jumping', key: 'jumping' },
                                   { label: 'Pace', key: 'pace' },
                                   { label: 'Stamina', key: 'stamina' },
                                   { label: 'Strength', key: 'strength' },
                                 ]
                               },
                             ].map(group => (
                               <div key={group.title} className="space-y-4">
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary/60 border-b border-brand-primary/20 pb-2 mb-4">{group.title}</h4>
                                 <div className="space-y-2.5">
                                   {group.attrs.map(attr => (
                                     <div key={attr.key} className="flex justify-between items-center group/stat">
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted group-hover/stat:text-brand-text transition-colors">{attr.label}</span>
                                       <span className={cn(
                                         "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm",
                                         player.stats[attr.key as keyof typeof player.stats] >= 85 ? "text-brand-primary bg-brand-primary/10" :
                                         player.stats[attr.key as keyof typeof player.stats] >= 70 ? "text-brand-text bg-white/5" :
                                         "text-brand-muted"
                                       )}>
                                         {Math.floor(player.stats[attr.key as keyof typeof player.stats])}
                                       </span>
                                     </div>
                                   ))}
                                 </div>
                               </div>
                             ))}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
