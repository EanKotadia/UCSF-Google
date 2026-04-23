import React from 'react';
import { ScheduleItem } from '../types';
import { cn } from '../lib/utils';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ScheduleCardProps {
  item: ScheduleItem;
  index?: number;
}

const ScheduleCard = React.memo(({ item, index = 0 }: ScheduleCardProps) => {
  const getStatus = () => {
    // If manual status is set to live or completed, respect it.
    if (item.status === 'live') return 'live';
    if (item.status === 'completed') return 'completed';

    // Automatic status logic
    try {
      const now = new Date();
      // Combine day_date and time_start to get start time
      // Assuming day_date is in a parseable format like "April 10, 2026"
      // and time_start is in format "09:00 AM"
      const startStr = `${item.day_date} ${item.time_start}`;
      const startDate = new Date(startStr);

      if (isNaN(startDate.getTime())) return item.status;

      let endDate: Date | null = null;
      if (item.time_end) {
        const endStr = `${item.day_date} ${item.time_end}`;
        endDate = new Date(endStr);
      }

      if (now < startDate) return 'upcoming';
      if (endDate && now > endDate) return 'completed';
      if (!endDate && now > startDate) {
         // If no end time, assume it stays live for 2 hours
         const twoHoursLater = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
         if (now > twoHoursLater) return 'completed';
         return 'live';
      }
      if (endDate && now >= startDate && now <= endDate) return 'live';
    } catch (e) {
      console.warn("Failed to parse date for auto-status", e);
    }

    return item.status;
  };

  const status = getStatus();
  const isLive = status === 'live';
  const isCompleted = status === 'completed';

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-0 items-start relative group",
        isLive ? "st-live" : isCompleted ? "st-completed" : "st-upcoming"
      )}
    >
      {/* Time Column */}
      <div className="pt-7 pr-4 md:pr-8 text-right flex-shrink-0">
        <div className="font-display text-lg md:text-2xl tracking-wider text-text leading-none group-hover:text-maple transition-colors">
          {item.time_start}
        </div>
        {item.time_end && (
          <div className="font-ui text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
            — {item.time_end}
          </div>
        )}
      </div>

      {/* Body Column */}
      <div className="relative pl-8 md:pl-12 pb-12 border-l border-border group-last:pb-0">
        {/* Node Dot */}
        <div className={cn(
          "absolute left-[-6px] top-7 w-3 h-3 rounded-full border-2 border-bg z-10 transition-all duration-500",
          isLive ? "bg-maple shadow-[0_0_15px_rgba(188,138,44,0.8)] scale-125 animate-pulse" :
          isCompleted ? "bg-cedar opacity-50" : "bg-bg3 ring-1 ring-border"
        )} />

        {/* Card */}
        <div className={cn(
          "card-glass p-8 transition-all duration-300 group-hover:translate-x-1 group-hover:border-maple/20",
          "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[4px]",
          isLive ? "before:bg-maple bg-maple/5 border-maple/20" :
          isCompleted ? "before:bg-cedar bg-cedar/5 border-cedar/10 opacity-80" :
          "before:bg-border/30"
        )}>
          <div className="flex flex-wrap items-start justify-between gap-6 mb-4">
            <div className="flex-1 min-w-[200px] space-y-2">
              <h4 className="text-2xl md:text-3xl text-white tracking-tight uppercase font-display group-hover:text-maple transition-colors">
                {item.title}
              </h4>
              {item.subtitle && (
                <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl font-medium">
                  {item.subtitle}
                </p>
              )}
            </div>
            
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all",
              isLive ? "bg-maple/10 border-maple/30 text-maple animate-pulse" :
              isCompleted ? "bg-white/5 border-white/10 text-muted/40" :
              "bg-white/5 border-white/10 text-muted"
            )}>
              {isLive ? "Ongoing Now" : isCompleted ? "Session Ended" : "Upcoming"}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t border-white/5">
            {item.venue && (
              <div className="flex items-center gap-2.5 font-ui text-[10px] text-muted font-bold uppercase tracking-[0.2em] group-hover:text-text transition-colors">
                <MapPin size={16} className="text-maple/60" />
                {item.venue}
              </div>
            )}
            <div className="flex items-center gap-2.5 font-ui text-[10px] text-muted font-bold uppercase tracking-[0.2em]">
               <Clock size={16} className="text-maple/30" />
               {item.time_start} Session
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ScheduleCard;
