import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Match } from '../types';
import { Trophy, Music, Palette, Film, Theater, Swords, Target, Users, Clock, Calendar, Info, ChevronRight, X, ArrowRight, Activity } from 'lucide-react';
import MatchCard from './MatchCard';
import { cn } from '../lib/utils';

interface EventsSectionProps {
  categories: Category[];
  matches: Match[];
  setActiveTab: (tab: string) => void;
}

export default function EventsSection({ categories, matches, setActiveTab }: EventsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sports = categories.filter(c => c.category_type === 'sport');
  const cultural = categories.filter(c => c.category_type === 'cultural');
  const other = categories.filter(c => !c.category_type);

  const expandedCategory = categories.find(c => c.id === expandedId);
  const expandedMatches = expandedId ? matches.filter(m => m.category_id === expandedId) : [];

  const generalGuidelines = [
    "Each student can represent only their own house.",
    "It is mandatory to fill out the Google Form and complete the registration process.",
    "A student may participate in a maximum of three events (including both sports and cultural events).",
    "Registration and audition submissions will close as per the dates shared in notices.",
    "All submissions must be made online through the official school links."
  ];

  const renderEventCard = (cat: Category) => {
    return (
      <motion.div
        key={cat.id}
        layoutId={`card-${cat.id}`}
        onClick={() => setExpandedId(cat.id)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col h-full hover:border-blue-500/30 transition-all group cursor-pointer font-ui"
      >
        <div className="flex items-start justify-between mb-8">
          <motion.div layoutId={`icon-${cat.id}`} className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform overflow-hidden border border-blue-500/20">
            {cat.icon || <Trophy className="text-blue-500" />}
          </motion.div>
          <div className="text-right">
            <span className="font-ui text-[9px] font-bold uppercase tracking-widest text-white/40 block mb-1">
              {cat.category_type || 'Event'}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full font-ui text-[8px] font-bold uppercase tracking-widest text-blue-500">
              {cat.gender || 'Mixed'}
            </span>
          </div>
        </div>

        <motion.h3 layoutId={`title-${cat.id}`} className="text-3xl font-display uppercase tracking-wider mb-6 leading-tight">{cat.name}</motion.h3>

        <div className="grid grid-cols-2 gap-6 mb-10">
          {cat.team_size && (
            <div className="space-y-1">
              <p className="font-ui text-[8px] font-bold text-white/40 uppercase tracking-widest">Team Size</p>
              <p className="text-sm font-medium text-white">{cat.team_size}</p>
            </div>
          )}
          {cat.duration && (
            <div className="space-y-1">
              <p className="font-ui text-[8px] font-bold text-white/40 uppercase tracking-widest">Duration</p>
              <p className="text-sm font-medium text-white">{cat.duration}</p>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-blue-500 font-ui text-[9px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
           <span>View Guidelines</span>
           <ArrowRight size={14} />
        </div>
      </motion.div>
    );
  };

  return (
    <div id="events" className="max-w-7xl mx-auto px-6 py-24 space-y-32 font-ui">
      <AnimatePresence>
        {expandedId && expandedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedId(null)}
              className="absolute inset-0 bg-[#050b1a]/95 backdrop-blur-2xl"
            />

            <motion.div
              layoutId={`card-${expandedId}`}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#0a1128] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto p-8 md:p-16 custom-scrollbar">
                <div className="flex flex-col md:flex-row gap-16 items-start">
                  <div className="flex-1 space-y-12">
                    <div className="flex items-center gap-10">
                      <motion.div layoutId={`icon-${expandedId}`} className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center text-5xl overflow-hidden border border-blue-500/20">
                        {expandedCategory.icon || <Trophy className="text-blue-500" />}
                      </motion.div>
                      <div>
                        <span className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 mb-3 block">
                          {expandedCategory.category_type} · {expandedCategory.gender || 'Mixed'}
                        </span>
                        <motion.h2 layoutId={`title-${expandedId}`} className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none">
                          {expandedCategory.name}
                        </motion.h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
                      {[
                        { label: 'Team Size', val: expandedCategory.team_size },
                        { label: 'Duration', val: expandedCategory.duration },
                        { label: 'Grades', val: expandedCategory.eligible_years },
                      ].filter(s => s.val).map((stat, i) => (
                        <div key={i} className="space-y-2">
                          <p className="font-ui text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-xl font-medium text-white">{stat.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-10">
                      <div>
                        <h4 className="text-2xl font-display uppercase tracking-widest mb-6 flex items-center gap-3 text-blue-500">
                          <Info size={20} />
                          Rules & Regulations
                        </h4>
                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10">
                          <p className="text-lg text-white/80 leading-relaxed whitespace-pre-line">
                            {expandedCategory.special_rules || "General rules apply for this category."}
                          </p>
                        </div>
                      </div>

                      {expandedCategory.judging_criteria && expandedCategory.judging_criteria.length > 0 && (
                        <div>
                          <h4 className="text-2xl font-display uppercase tracking-widest mb-6 text-blue-500">Judging Criteria</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {expandedCategory.judging_criteria.map((item, i) => (
                              <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex justify-between items-center">
                                <span className="text-lg font-medium">{item.criterion}</span>
                                <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-4 py-1 rounded-full border border-blue-500/20">{item.weight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-80 shrink-0 space-y-10">
                    <h4 className="text-2xl font-display uppercase tracking-widest flex items-center justify-between text-blue-500">
                      Matches
                      <span className="text-[10px] font-bold text-white/20">{expandedMatches.length} Total</span>
                    </h4>

                    <div className="space-y-4">
                      {expandedMatches.length > 0 ? (
                        expandedMatches.map(match => (
                          <MatchCard key={match.id} match={match} />
                        ))
                      ) : (
                        <div className="bg-white/5 border border-white/5 border-dashed rounded-[2rem] p-12 text-center">
                          <Activity size={32} className="mx-auto mb-4 text-white/5" />
                          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">No matches scheduled yet</p>
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
        <div className="mb-16">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">UCSF Protocol</p>
          <h2 className="text-6xl md:text-8xl font-display uppercase leading-none">General Guidelines</h2>
          <p className="text-white/40 mt-6 text-xl max-w-2xl leading-relaxed">Essential information for all Union of Culture & Sports Fest 2026 participants.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/5 p-12 rounded-[2.5rem] backdrop-blur-xl">
            <ul className="space-y-8">
              {generalGuidelines.slice(0, 3).map((item, i) => (
                <li key={i} className="flex gap-6 text-white/80 leading-relaxed group">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/5 p-12 rounded-[2.5rem] backdrop-blur-xl">
            <ul className="space-y-8">
              {generalGuidelines.slice(3).map((item, i) => (
                <li key={i} className="flex gap-6 text-white/80 leading-relaxed group">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2.5 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {sports.length > 0 && (
        <section>
          <div className="mb-16">
             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Athletics</p>
            <h2 className="text-6xl md:text-8xl font-display uppercase leading-none">Sports Events</h2>
            <p className="text-white/40 mt-6 text-xl max-w-2xl leading-relaxed">High-intensity competitive events across multiple disciplines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sports.map(renderEventCard)}
          </div>
        </section>
      )}

      {cultural.length > 0 && (
        <section>
          <div className="mb-16">
             <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Arts & Expression</p>
            <h2 className="text-6xl md:text-8xl font-display uppercase leading-none">Cultural Events</h2>
            <p className="text-white/40 mt-6 text-xl max-w-2xl leading-relaxed">Showcasing talent, creativity, and artistic excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cultural.map(renderEventCard)}
          </div>
        </section>
      )}
    </div>
  );
}
