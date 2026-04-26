import React from 'react';
import { ScheduleItem } from '../types';
import { motion } from 'motion/react';
import { MapPin, Clock, Calendar } from 'lucide-react';
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
        "bg-white border border-border p-8 rounded-3xl flex flex-col md:flex-row md:items-center gap-8 group hover:border-primary/20 transition-all shadow-sm",
        isLive && "border-primary/30 bg-primary-muted/10 shadow-lg"
      )}
    >
      <div className="md:w-32 flex flex-col border-l-4 border-primary pl-6">
        <span className="text-primary font-display text-2xl leading-none">{item.time_start?.slice(0, 5)}</span>
        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-1.5">{item.day_label}</span>
      </div>

      <div className="flex-grow">
        <h3 className="text-2xl font-display uppercase tracking-tight text-text mb-1">{item.title}</h3>
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
           <MapPin size={12} className="text-primary" />
           {item.venue} <span className="text-border">|</span> {item.subtitle}
        </p>
      </div>

      <div className="shrink-0">
        <span className={cn(
          "px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest border",
          isLive ? "bg-green-100 text-green-700 border-green-200 animate-pulse" :
          isCompleted ? "bg-bg-alt text-text-muted border-border" : "bg-primary-muted text-primary border-primary/10"
        )}>
          {isLive ? 'In Progress' : isCompleted ? 'Finished' : 'Upcoming'}
        </span>
      </div>
    </motion.div>
  );
}
