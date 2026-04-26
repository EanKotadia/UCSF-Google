import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Info, X, ArrowRight } from 'lucide-react';
import { Category, Match } from '../types';
import { cn } from '../lib/utils';
import MatchCard from './MatchCard';

interface EventsSectionProps {
  categories: Category[];
  matches: Match[];
  setActiveTab: (tab: string) => void;
}

export default function EventsSection({ categories, matches, setActiveTab }: EventsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sports = categories.filter(c => c.category_type === 'sport');
  const cultural = categories.filter(c => c.category_type === 'cultural');

  const generalGuidelines = [
    "Participants must report to the venue 30 minutes before the scheduled time.",
    "Decisions of the judges and referees will be final and binding.",
    "Any form of indiscipline or misconduct will lead to immediate disqualification.",
    "Official ID cards are mandatory for all participants at all times.",
    "Equipment required for specific events must be brought by the participants unless stated otherwise."
  ];

  const expandedCategory = categories.find(c => c.id === expandedId);
  const expandedMatches = matches.filter(m => m.category_id === expandedId);

  const renderEventCard = (cat: Category) => {
    return (
      <motion.div
        key={cat.id}
        layoutId={`card-${cat.id}`}
        onClick={() => setExpandedId(cat.id)}
        className="card-glass p-10 group cursor-pointer hover:border-accent/30 transition-all flex flex-col gap-8"
      >
        <div className="flex justify-between items-start">
          <motion.div layoutId={`icon-${cat.id}`} className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-3xl overflow-hidden border border-accent/10">
            {cat.icon || <Trophy className="text-accent" />}
          </motion.div>
          <span className="badge badge-upcoming bg-white/5">
            {cat.category_type}
          </span>
        </div>

        <div className="space-y-3">
          <motion.h3 layoutId={`title-${cat.id}`} className="text-3xl font-display uppercase tracking-tight text-text leading-tight">
            {cat.name}
          </motion.h3>
          <p className="text-muted text-sm line-clamp-2 leading-relaxed">
            {cat.special_rules || "Official UCSF 2026 competitive category."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cat.team_size && (
            <div className="space-y-1">
              <p className="font-ui text-[10px] font-bold text-subtle uppercase tracking-widest">Team Size</p>
              <p className="text-xs font-bold text-text">{cat.team_size}</p>
            </div>
          )}
          {cat.duration && (
            <div className="space-y-1">
              <p className="font-ui text-[10px] font-bold text-subtle uppercase tracking-widest">Duration</p>
              <p className="text-xs font-bold text-text">{cat.duration}</p>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-accent font-ui text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
           <span>View Details</span>
           <ArrowRight size={14} />
        </div>
      </motion.div>
    );
  };

  return (
    <div id="events" className="max-w-7xl mx-auto px-6 py-32 space-y-40 font-sans relative">
      <AnimatePresence>
        {expandedId && expandedCategory && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedId(null)}
              className="absolute inset-0 bg-bg/95 backdrop-blur-xl"
            />

            <motion.div
              layoutId={`card-${expandedId}`}
              className="relative w-full max-w-6xl max-h-[90vh] bg-bg border border-border rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-text transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto p-10 md:p-20 custom-scrollbar">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                  <div className="flex-1 space-y-16">
                    <div className="flex flex-col md:flex-row md:items-center gap-10">
                      <motion.div layoutId={`icon-${expandedId}`} className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center text-5xl overflow-hidden border border-accent/10 shrink-0">
                        {expandedCategory.icon || <Trophy className="text-accent" />}
                      </motion.div>
                      <div>
                        <span className="font-ui text-[11px] font-bold uppercase tracking-[4px] text-accent mb-4 block">
                          {expandedCategory.category_type} · {expandedCategory.gender || 'Mixed'}
                        </span>
                        <motion.h2 layoutId={`title-${expandedId}`} className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none text-text">
                          {expandedCategory.name}
                        </motion.h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 border-t border-border">
                      {[
                        { label: 'Team Size', val: expandedCategory.team_size },
                        { label: 'Duration', val: expandedCategory.duration },
                        { label: 'Grades', val: expandedCategory.eligible_years },
                      ].filter(s => s.val).map((stat, i) => (
                        <div key={i} className="space-y-2">
                          <p className="font-ui text-[11px] font-bold text-muted uppercase tracking-widest">{stat.label}</p>
                          <p className="text-3xl font-display text-accent">{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-12">
                      <div>
                        <h4 className="text-2xl font-display uppercase tracking-widest mb-8 flex items-center gap-4 text-accent">
                          <Info size={24} />
                          Event Description
                        </h4>
                        <div className="bg-white/5 border border-border rounded-[2.5rem] p-12">
                          <p className="text-xl text-muted leading-relaxed whitespace-pre-line">
                            {expandedCategory.special_rules || "Detailed guidelines for this category will be updated shortly."}
                          </p>
                        </div>
                      </div>

                      {expandedCategory.judging_criteria && expandedCategory.judging_criteria.length > 0 && (
                        <div>
                          <h4 className="text-2xl font-display uppercase tracking-widest mb-8 text-accent">Judging Criteria</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {expandedCategory.judging_criteria.map((item, i) => (
                              <div key={i} className="card-glass p-8 flex justify-between items-center shadow-sm">
                                <span className="text-lg font-bold text-text">{item.criterion}</span>
                                <span className="badge badge-upcoming bg-accent/10 text-accent border border-accent/20">{item.weight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-96 shrink-0 space-y-12">
                    <h4 className="text-2xl font-display uppercase tracking-widest flex items-center justify-between text-accent">
                      Recent Activity
                      <span className="text-[11px] font-bold text-subtle">{expandedMatches.length} Matches</span>
                    </h4>

                    <div className="space-y-6">
                      {expandedMatches.length > 0 ? (
                        expandedMatches.map(match => (
                          <MatchCard key={match.id} match={match} />
                        ))
                      ) : (
                        <div className="card-glass border-dashed p-16 text-center">
                          <Activity size={40} className="mx-auto mb-6 text-subtle" />
                          <p className="text-subtle text-[11px] font-bold uppercase tracking-widest">No activity logged</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* General Guidelines */}
      <section>
        <div className="mb-20">
          <div className="sec-label">UCSF 2026</div>
          <h2 className="text-6xl md:text-8xl font-display uppercase leading-none text-text">General Guidelines</h2>
          <p className="text-muted mt-8 text-xl max-w-2xl leading-relaxed">Essential information for all participants of the Union of Culture & Sports Fest.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card-glass p-16 shadow-sm">
            <ul className="space-y-10">
              {generalGuidelines.slice(0, 3).map((item, i) => (
                <li key={i} className="flex gap-8 text-muted leading-relaxed group">
                  <div className="w-[1px] h-12 bg-accent/30 mt-2 shrink-0 group-hover:bg-accent transition-colors" />
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-glass p-16 shadow-sm">
            <ul className="space-y-10">
              {generalGuidelines.slice(3).map((item, i) => (
                <li key={i} className="flex gap-8 text-muted leading-relaxed group">
                  <div className="w-[1px] h-12 bg-accent/30 mt-2 shrink-0 group-hover:bg-accent transition-colors" />
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {sports.length > 0 && (
        <section>
          <div className="mb-20">
             <div className="sec-label">Athletics</div>
            <h2 className="text-6xl md:text-8xl font-display uppercase leading-none text-text">Sports Events</h2>
            <p className="text-muted mt-8 text-xl max-w-2xl leading-relaxed">High-intensity competitive events across multiple disciplines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sports.map(renderEventCard)}
          </div>
        </section>
      )}

      {cultural.length > 0 && (
        <section>
          <div className="mb-20">
             <div className="sec-label">Arts & Expression</div>
            <h2 className="text-6xl md:text-8xl font-display uppercase leading-none text-text">Cultural Events</h2>
            <p className="text-muted mt-8 text-xl max-w-2xl leading-relaxed">Showcasing talent, creativity, and artistic excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cultural.map(renderEventCard)}
          </div>
        </section>
      )}
    </div>
  );
}
