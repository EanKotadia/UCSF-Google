import { ScheduleItem } from '../types';
import { cn } from '../lib/utils';
import { MapPin, Clock, Users } from 'lucide-react';

interface ScheduleCardProps {
  item: ScheduleItem;
  key?: any;
}

export default function ScheduleCard({ item }: ScheduleCardProps) {
  const isLive = item.status === 'live';
  const isCompleted = item.status === 'completed';

  return (
    <div className={cn(
      "relative pl-10 pb-10 border-l border-white/10 last:pb-0",
      isLive ? "border-cedar/50" : ""
    )}>
      {/* Timeline Dot */}
      <div className={cn(
        "absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full transition-all duration-500",
        isLive ? "bg-cedar ring-4 ring-cedar/20 scale-125" : 
        isCompleted ? "bg-white/20" : "bg-maple shadow-[0_0_10px_rgba(245,197,24,0.5)]"
      )} />

      <div className={cn(
        "card-glass p-6 border-white/10 transition-all group hover:border-maple/30",
        isLive ? "bg-cedar/5 border-cedar/20" : ""
      )}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-xl font-display tracking-wider text-white group-hover:text-maple transition-colors">{item.title}</h4>
              {isLive && (
                <span className="px-2 py-0.5 bg-cedar text-white text-[9px] font-black uppercase tracking-widest skew-x-[-12deg] animate-pulse">
                  <span className="inline-block skew-x-[12deg]">Live</span>
                </span>
              )}
            </div>
            {item.subtitle && <p className="font-ui text-sm font-bold uppercase tracking-widest text-white/40">{item.subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 font-ui text-xs font-bold text-maple uppercase tracking-widest">
            <Clock size={14} />
            {item.time_start} {item.time_end && <span className="mx-1 text-white/20">—</span>} {item.time_end}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-white/5">
          {item.venue && (
            <div className="flex items-center gap-2 font-ui text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <MapPin size={14} className="text-maple" />
              {item.venue}
            </div>
          )}
          {item.house_ids && (
            <div className="flex items-center gap-2 font-ui text-[10px] text-white/40 font-bold uppercase tracking-widest">
              <Users size={14} className="text-maple" />
              {item.house_ids.split(',').map((id, idx) => (
                <span key={id}>
                  {id.trim()}
                  {idx < item.house_ids!.split(',').length - 1 && <span className="mx-1 text-white/10">•</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
