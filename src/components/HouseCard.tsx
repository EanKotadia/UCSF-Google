import { motion } from 'motion/react';
import { House } from '../types';
import { cn } from '../lib/utils';
import { Trophy, Star, Shield } from 'lucide-react';

interface HouseCardProps {
  house: House;
  isTop?: boolean;
  key?: any;
}

export default function HouseCard({ house, isTop }: HouseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "card-glass relative overflow-hidden rounded-none transition-all duration-300 group",
        isTop ? "border-maple/30 shadow-[0_0_30px_rgba(245,197,24,0.1)]" : "border-white/10"
      )}
    >
      {/* Rank Badge */}
      <div className={cn(
        "absolute top-0 right-0 w-12 h-12 flex items-center justify-center font-display text-2xl skew-x-[-12deg] origin-top-right",
        house.rank_pos === 1 ? "bg-maple text-black" :
        house.rank_pos === 2 ? "bg-slate-300 text-black" :
        house.rank_pos === 3 ? "bg-orange-400 text-black" : "bg-white/10 text-white/50"
      )}>
        <span className="skew-x-[12deg]">{house.rank_pos}</span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-5 mb-8">
          <div 
            className="w-20 h-20 flex items-center justify-center text-5xl relative"
          >
            <div className="absolute inset-0 blur-2xl opacity-20" style={{ backgroundColor: house.color }} />
            <span className="relative z-10 filter drop-shadow-lg">{house.mascot || '🛡️'}</span>
          </div>
          <div>
            <h3 className="text-2xl font-display tracking-wider text-white group-hover:text-maple transition-colors">{house.name}</h3>
            <p className="font-ui text-sm font-bold uppercase tracking-widest text-white/40">{house.mascot_name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative group/points">
            <div className="absolute -inset-1 bg-gradient-to-r from-maple/20 to-transparent opacity-0 group-hover/points:opacity-100 transition-opacity blur-sm" />
            <div className="relative flex items-center justify-between p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                <Trophy size={16} className="text-maple" />
                Points
              </div>
              <span className="text-4xl font-display text-maple leading-none">{house.points}</span>
            </div>
          </div>

          {house.motto && (
            <div className="relative pl-4 border-l border-maple/30">
              <p className="text-sm text-white/50 italic font-medium leading-relaxed">
                "{house.motto}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decorative background element */}
      <div 
        className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl transition-all group-hover:opacity-20"
        style={{ backgroundColor: house.color }}
      />
    </motion.div>
  );
}
