import { Match } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { MapPin, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  key?: any;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-glass rounded-none border-white/10 overflow-hidden group"
    >
      {/* Match Header */}
      <div className="px-5 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl filter drop-shadow-md">{match.category?.icon}</span>
          <span className="font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
            {match.category?.name} <span className="mx-2 text-white/10">|</span> M{match.match_no}
          </span>
        </div>
        <div className={cn(
          "px-3 py-1 font-ui text-[9px] font-black uppercase tracking-[0.2em] skew-x-[-12deg]",
          isLive ? "bg-cedar text-white animate-pulse" :
          isCompleted ? "bg-white/10 text-white/60" : "bg-ebony text-white"
        )}>
          <span className="inline-block skew-x-[12deg]">{match.status}</span>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center justify-between gap-6">
          {/* Team 1 */}
          <div className="flex-1 flex flex-col items-center text-center gap-3 group/team">
            <div 
              className="w-16 h-16 flex items-center justify-center text-3xl relative transition-transform group-hover/team:scale-110"
            >
              <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: match.team1?.color }} />
              <span className="relative z-10">{match.team1?.mascot}</span>
            </div>
            <span className="font-display text-lg text-white tracking-wide uppercase">{match.team1?.name}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <span className={cn(
                "text-5xl font-display tabular-nums leading-none",
                isCompleted && match.score1! > match.score2! ? "text-maple" : "text-white"
              )}>
                {match.score1 ?? '-'}
              </span>
              <span className="text-white/20 font-display text-3xl">:</span>
              <span className={cn(
                "text-5xl font-display tabular-nums leading-none",
                isCompleted && match.score2! > match.score1! ? "text-maple" : "text-white"
              )}>
                {match.score2 ?? '-'}
              </span>
            </div>
            {isLive && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cedar animate-ping" />
                <span className="font-ui text-[10px] font-bold text-cedar uppercase tracking-widest">Live</span>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex-1 flex flex-col items-center text-center gap-3 group/team">
            <div 
              className="w-16 h-16 flex items-center justify-center text-3xl relative transition-transform group-hover/team:scale-110"
            >
              <div className="absolute inset-0 blur-xl opacity-20" style={{ backgroundColor: match.team2?.color }} />
              <span className="relative z-10">{match.team2?.mascot}</span>
            </div>
            <span className="font-display text-lg text-white tracking-wide uppercase">{match.team2?.name}</span>
          </div>
        </div>

        {/* Venue & Time */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-6 justify-center">
          {match.venue && (
            <div className="flex items-center gap-2 font-ui text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <MapPin size={14} className="text-maple" />
              {match.venue}
            </div>
          )}
          {match.match_time && (
            <div className="flex items-center gap-2 font-ui text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <Clock size={14} className="text-maple" />
              {new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
