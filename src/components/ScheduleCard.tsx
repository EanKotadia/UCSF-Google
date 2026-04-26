import React from 'react';
import { ScheduleItem } from '../types';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScheduleCardProps {
  item: ScheduleItem;
}

export default function ScheduleCard({ item }: ScheduleCardProps) {
  const isLive = item.status === 'live';
  const isCompleted = item.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "card-glass p-10 flex flex-col md:flex-row md:items-center gap-10 group hover:border-accent/30 transition-all shadow-xl",
        isLive && "border-danger/20"
      )}
    >
      <div className="md:w-40 flex flex-col border-l-4 border-accent pl-6 py-2">
        <span className="text-accent font-display text-4xl">{item.time_start?.slice(0, 5)}</span>
        <span className="text-muted text-[11px] font-bold uppercase tracking-widest mt-2">{item.day_label}</span>
      </div>

      <div className="flex-grow">
        <h3 className="text-3xl font-display uppercase tracking-tight mb-2 text-text">{item.title}</h3>
        <p className="text-muted text-[13px] font-bold uppercase tracking-widest flex items-center gap-3">
           <Info size={14} className="text-accent/50" />
           {item.venue} • {item.subtitle}
        </p>
      </div>

      <div className="shrink-0">
        <span className={cn(
          "badge",
          isLive ? "badge-live animate-pulse" :
          isCompleted ? "badge-completed" : "badge-upcoming"
        )}>
          {isLive ? 'In Progress' : isCompleted ? 'Finished' : 'Upcoming'}
        </span>
      </div>
    </motion.div>
  );
}
