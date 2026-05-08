import { useState, useMemo } from 'react';
import { Globe, Search, ArrowRightLeft, TrendingUp, ShieldAlert, Zap, Filter, ChevronDown, Trophy, Target, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { cn } from '../lib/utils';
import { useGameData } from '../lib/useGameData';

export default function Transfers() {
  const [activeTab, setActiveTab] = useState<'market' | 'bids'>('market');
  const { players: allPlayers } = useGameData();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    position: 'ALL',
    minAge: 16,
    maxAge: 40,
    minRating: 0,
    nationality: 'ALL',
    trend: 'ALL'
  });

  const filteredPlayers = useMemo(() => {
    return allPlayers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPosition = filters.position === 'ALL' || p.position === filters.position;
      const matchesAge = p.age >= filters.minAge && p.age <= filters.maxAge;
      const matchesRating = p.rating >= filters.minRating;
      const matchesNat = filters.nationality === 'ALL' || p.nationality === filters.nationality;
      const matchesTrend = filters.trend === 'ALL' || p.developmentTrend === filters.trend;
      
      return matchesSearch && matchesPosition && matchesAge && matchesRating && matchesNat && matchesTrend;
    });
  }, [allPlayers, searchQuery, filters]);

  const nationalities = Array.from(new Set(allPlayers.map(p => p.nationality))).sort();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-brand-text">Global Transfer Hub</h2>
          <p className="text-brand-muted font-bold text-[9px] uppercase tracking-widest mt-1">Live Market Data Active • {filteredPlayers.length} scouting results</p>
        </div>
        <div className="flex bg-brand-surface border border-brand-border rounded-sm p-1 shadow-inner h-fit">
          <button 
            onClick={() => setActiveTab('market')}
            className={cn(
              "px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all",
              activeTab === 'market' ? "bg-brand-primary text-black" : "text-brand-muted hover:text-brand-text"
            )}
          >
            Marketplace
          </button>
          <button 
            onClick={() => setActiveTab('bids')}
            className={cn(
              "px-6 py-2 rounded-sm text-[9px] font-bold uppercase tracking-widest transition-all",
              activeTab === 'bids' ? "bg-brand-primary text-black" : "text-brand-muted hover:text-brand-text"
            )}
          >
            Negotiations
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'market' ? (
          <motion.div 
            key="market"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Scouting Sidebar */}
            <aside className="lg:col-span-3 space-y-6">
               <div className="bg-brand-surface border border-brand-border rounded-sm p-6 space-y-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-text">Advanced Scouting</h3>
                  </div>

                  {/* Position Filter */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Primary Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['ALL', 'GK', 'DEF', 'MID', 'ATT'].map(pos => (
                        <button
                          key={pos}
                          onClick={() => setFilters(f => ({ ...f, position: pos }))}
                          className={cn(
                            "px-3 py-2 rounded-sm text-[9px] font-bold border transition-all",
                            filters.position === pos 
                              ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                              : "bg-black/20 border-white/5 text-brand-muted hover:border-white/10"
                          )}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Min Rating</label>
                      <span className="text-[10px] font-mono text-brand-primary font-bold">{filters.minRating}+</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="99" 
                      value={filters.minRating}
                      onChange={(e) => setFilters(f => ({ ...f, minRating: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
                    />
                  </div>

                  {/* Age Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Min Age</label>
                      <input 
                        type="number"
                        value={filters.minAge}
                        onChange={(e) => setFilters(f => ({ ...f, minAge: parseInt(e.target.value) }))}
                        className="w-full bg-black/40 border border-white/5 rounded-sm p-2 text-xs font-mono font-bold text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Max Age</label>
                      <input 
                        type="number"
                        value={filters.maxAge}
                        onChange={(e) => setFilters(f => ({ ...f, maxAge: parseInt(e.target.value) }))}
                        className="w-full bg-black/40 border border-white/5 rounded-sm p-2 text-xs font-mono font-bold text-center"
                      />
                    </div>
                  </div>

                  {/* Nationality Dropdown */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Nationality</label>
                    <div className="relative">
                      <select 
                        value={filters.nationality}
                        onChange={(e) => setFilters(f => ({ ...f, nationality: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-sm p-3 text-[10px] font-bold uppercase tracking-widest appearance-none outline-none focus:border-brand-primary"
                      >
                        <option value="ALL">ANY COUNTRY</option>
                        {nationalities.map(nat => (
                          <option key={String(nat)} value={String(nat)}>{String(nat).toUpperCase()}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-brand-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Potential Filter */}
                  <div className="space-y-3 pt-4 border-t border-brand-border">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted">Development Trend</label>
                    <div className="space-y-2">
                       {['ALL', 'rising', 'stable', 'declining'].map(trend => (
                         <button
                           key={trend}
                           onClick={() => setFilters(f => ({ ...f, trend }))}
                           className={cn(
                             "w-full px-4 py-2 rounded-sm text-[9px] font-bold border transition-all text-left flex items-center justify-between",
                             filters.trend === trend 
                               ? "bg-brand-primary/10 border-brand-primary text-brand-primary" 
                               : "bg-black/20 border-white/5 text-brand-muted hover:border-white/10"
                           )}
                         >
                           {trend.toUpperCase()}
                           {trend === 'rising' && <Zap className="w-3 h-3" />}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
               
               <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-sm p-4 text-center">
                  <p className="text-[8px] font-bold text-brand-primary uppercase tracking-[0.2em]">Scout Recommendations</p>
                  <p className="text-[10px] text-brand-muted mt-2">Adjust personnel filters to refine search database</p>
               </div>
            </aside>

            {/* Results Area */}
            <main className="lg:col-span-9 space-y-6">
              {/* Search Header */}
              <div className="relative group overflow-hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted group-focus-within:text-brand-primary transition-colors z-10" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Scout database for specific keywords..."
                  className="w-full bg-brand-surface border border-brand-border group-focus-within:border-brand-primary rounded-sm py-5 pl-12 pr-4 text-xs font-bold outline-none transition-all placeholder:text-brand-muted uppercase tracking-widest relative z-0"
                />
                <div className="absolute top-0 right-0 h-full flex items-center pr-4 text-[8px] font-mono font-bold text-brand-muted opacity-50">
                  {filteredPlayers.length} RECORDS FOUND
                </div>
              </div>

              {filteredPlayers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredPlayers.map((player) => (
                    <motion.div 
                      layout
                      key={player.id} 
                      className="bg-brand-surface border border-brand-border rounded-sm p-5 hover:border-brand-primary transition-all cursor-pointer group shadow-lg hover:shadow-brand-primary/5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-sm bg-black/40 border border-white/5 flex items-center justify-center font-bold text-lg text-brand-primary group-hover:scale-110 transition-transform">
                          {Math.floor(player.rating)}
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary mb-1">€{(player.value / 1000000).toFixed(1)}M</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-[8px] font-bold text-brand-muted uppercase bg-white/5 px-1 rounded-sm">{player.position}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-black italic uppercase tracking-tight text-brand-text group-hover:text-brand-primary transition-colors truncate">{player.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] text-brand-muted font-bold uppercase tracking-widest">{player.nationality}</span>
                          <span className="w-1 h-1 bg-brand-border rounded-full" />
                          <span className="text-[8px] text-brand-muted font-bold uppercase tracking-widest">{player.age} YRS</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="flex items-center justify-between px-2 py-1.5 bg-black/20 rounded-sm">
                           <span className="text-[8px] font-bold text-brand-muted uppercase">Potential</span>
                           <span className="text-[9px] font-mono font-bold text-brand-text">{Math.floor(player.potential)}</span>
                        </div>
                        <div className="flex items-center justify-between px-2 py-1.5 bg-black/20 rounded-sm">
                           <span className="text-[8px] font-bold text-brand-muted uppercase">Trend</span>
                           {player.developmentTrend === 'rising' ? (
                             <TrendingUp className="w-2.5 h-2.5 text-brand-primary" />
                           ) : (
                             <Minus className="w-2.5 h-2.5 text-brand-muted/20" />
                           )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 border border-dashed border-brand-border rounded-sm">
                  <Target className="w-12 h-12 text-brand-muted mx-auto opacity-20" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-muted">No Personnel Matches Found</h3>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-brand-muted/50 mt-1">Reset filters to broaden search parameters</p>
                  </div>
                </div>
              )}
            </main>
          </motion.div>
        ) : (
          <motion.div 
            key="bids"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center opacity-20 gap-8"
          >
            <ArrowRightLeft className="w-16 h-16 text-brand-muted" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-widest">No Negotiations Active</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-muted">Submit official documentation through the marketplace</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

