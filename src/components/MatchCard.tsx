import React from 'react';
import { Match } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { MapPin, Clock, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
  onClick?: () => void;
}

const MatchCard = React.memo(({ match, compact, onClick }: MatchCardProps) => {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      className={cn(
        "bg-white border border-border rounded-2xl p-6 relative group transition-all",
        onClick && "cursor-pointer hover:border-primary/20 hover:shadow-md",
        isLive && "border-green-200 bg-green-50/30"
      )}
    >
      <div className="flex justify-between items-start mb-6">
         <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
               {match.category?.name}
            </span>
            <div className={cn(
               "text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit border",
               isLive ? "bg-green-100 text-green-700 border-green-200 animate-pulse" :
               isCompleted ? "bg-bg-alt text-text-muted border-border" : "bg-primary-muted text-primary border-primary/10"
            )}>
               {match.status}
            </div>
         </div>
         {isCompleted && (
            <Trophy size={16} className="text-accent" />
         )}
      </div>

      <div className="flex items-center justify-between gap-4">
         <div className="flex-1 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-text mb-2 line-clamp-1">{match.team1?.name}</p>
            <p className="text-3xl font-display text-primary">{match.score1 ?? '-'}</p>
         </div>
         <div className="text-border font-display text-sm">VS</div>
         <div className="flex-1 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-text mb-2 line-clamp-1">{match.team2?.name}</p>
            <p className="text-3xl font-display text-primary">{match.score2 ?? '-'}</p>
         </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 items-center justify-center">
         {match.venue && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted uppercase tracking-widest">
               <MapPin size={12} className="text-primary" />
               {match.venue}
            </div>
         )}
         {match.match_time && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted uppercase tracking-widest">
               <Clock size={12} className="text-primary" />
               {new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
         )}
      </div>
    </motion.div>
  );
});

export default MatchCard;
