import { motion } from 'motion/react';
import { INITIAL_CLUBS } from '../constants';
import { ShieldAlert, TrendingUp, Users, Wallet, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../lib/AuthProvider';

export default function ClubSelector() {
  const { updateProfile } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
      {INITIAL_CLUBS.map((club, index) => (
        <motion.button
          key={club.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => updateProfile({ clubId: club.id })}
          className="group relative bg-brand-surface border border-brand-border rounded-sm p-6 text-left hover:border-brand-primary/50 transition-all overflow-hidden"
        >
          <div 
            className="absolute top-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity"
            style={{ 
              background: `radial-gradient(circle at top right, ${club.colors[0]}, transparent)` 
            }}
          />
          
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-sm flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform border border-white/5"
              style={{ backgroundColor: club.colors[0] }}
            >
              <ShieldAlert className="w-6 h-6" style={{ color: club.colors[1] }} />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tighter text-base leading-tight text-brand-text group-hover:text-brand-primary transition-colors">{club.name}</h3>
              <p className="text-[9px] text-brand-muted font-bold uppercase tracking-widest">{club.shortName} FC</p>
            </div>
          </div>

          <div className="mb-6 flex gap-2">
            {club.budget > 150000000 ? (
              <span className="text-[8px] font-black uppercase bg-brand-primary text-black px-2 py-0.5 rounded-sm">Elite Tier</span>
            ) : club.budget > 80000000 ? (
              <span className="text-[8px] font-black uppercase bg-white/10 text-brand-text px-2 py-0.5 rounded-sm">Established</span>
            ) : (
              <span className="text-[8px] font-black uppercase bg-red-500/20 text-red-500 px-2 py-0.5 rounded-sm">Underdog</span>
            )}
            <span className="text-[8px] font-bold uppercase border border-brand-border text-brand-muted px-2 py-0.5 rounded-sm">Difficulty: {club.budget > 150000000 ? 'Low' : club.budget > 80000000 ? 'Medium' : 'High'}</span>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-bold text-brand-muted">
              <div className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-brand-primary" />
                <span>Resources</span>
              </div>
              <span className="text-brand-text font-mono">€{(club.budget / 1000000).toFixed(0)}M</span>
            </div>
            <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-bold text-brand-muted">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                <span>Influence</span>
              </div>
              <span className="text-brand-text font-mono">{club.reputation}%</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary">Select Team</span>
            <ArrowRightLeft className="w-4 h-4 text-brand-primary" />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
