import React from 'react';
import { ScheduleItem } from '../types';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScheduleCardProps {
  item: ScheduleItem;
  index: number;
}

export default function ScheduleCard({ item, index }: ScheduleCardProps) {
  const status = item.status || 'upcoming';

  return (
    <div className="card-glass p-6 flex flex-col md:flex-row md:items-center justify-between group">
      <div className="flex items-center gap-6">
        <div className="text-center min-w-[80px]">
          <div className="text-xl font-display text-white">{item.time_start}</div>
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest">{item.day_label}</div>
        </div>
        <div className="h-10 w-px bg-white/10 hidden md:block" />
        <div>
          <h4 className="text-xl font-display text-white group-hover:text-maple transition-colors uppercase">{item.title}</h4>
          <div className="flex items-center gap-2 text-white/40 text-xs mt-1 uppercase font-bold tracking-widest">
            <MapPin size={12} /> {item.venue}
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-0">
        <span className={cn(
          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
          status === 'live' ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" :
          status === 'completed' ? "bg-white/5 text-white/30 border-white/10" :
          "bg-maple/10 text-maple border-maple/20"
        )}>
          {status}
        </span>
      </div>
    </div>
  );
}
