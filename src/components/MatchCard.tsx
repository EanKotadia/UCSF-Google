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
        "card-glass p-6 relative group transition-all",
        onClick && "cursor-pointer hover:border-accent/30 hover:shadow-lg",
        isLive && "border-danger/30"
      )}
    >
      <div className="flex justify-between items-start mb-6">
         <div className="flex flex-col gap-1">
            <span className="text-[10px] font-ui font-bold text-muted uppercase tracking-widest">
               {match.category?.name}
            </span>
            <div className={cn(
               "badge",
               isLive ? "badge-live animate-pulse" :
               isCompleted ? "badge-completed" : "badge-upcoming"
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
            <p className="font-ui text-[13px] font-bold uppercase tracking-wider text-text mb-3 line-clamp-1">{match.team1?.name}</p>
            <p className="font-display text-4xl text-accent">{match.score1 ?? '-'}</p>
         </div>
         <div className="text-subtle font-display text-xl">:</div>
         <div className="flex-1 text-center">
            <p className="font-ui text-[13px] font-bold uppercase tracking-wider text-text mb-3 line-clamp-1">{match.team2?.name}</p>
            <p className="font-display text-4xl text-accent">{match.score2 ?? '-'}</p>
         </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 items-center justify-center">
         {match.venue && (
            <div className="flex items-center gap-1.5 text-[10px] font-ui font-bold text-muted uppercase tracking-widest">
               <MapPin size={12} className="text-accent/50" />
               {match.venue}
            </div>
         )}
         {match.match_time && (
            <div className="flex items-center gap-1.5 text-[10px] font-ui font-bold text-muted uppercase tracking-widest">
               <Clock size={12} className="text-accent/50" />
               {new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
         )}
      </div>
    </motion.div>
  );
});

export default MatchCard;
