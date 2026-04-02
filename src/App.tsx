import React, { useState } from 'react';
import Layout from './components/Layout';
import HouseCard from './components/HouseCard';
import MatchCard from './components/MatchCard';
import ScheduleCard from './components/ScheduleCard';
import { useUCSFData } from './hooks/useUCSFData';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Calendar, Shield, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { houses, matches, schedule, settings, categories, loading, error, refresh } = useUCSFData();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-maple/20 border-t-maple rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="text-maple" size={24} />
          </div>
        </div>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-maple animate-pulse">Loading Fest Data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark p-6 text-center">
        <div className="w-20 h-20 bg-cedar/10 text-cedar rounded-3xl flex items-center justify-center mb-6 border border-cedar/20">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-display text-white mb-4">Connection Error</h2>
        <p className="text-white/40 max-w-md mb-8 font-medium">
          We couldn't connect to the UCSF database. Please check your credentials.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-0">
            {/* HERO */}
            <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,197,24,0.05)_0%,transparent_70%)]" />
              <div className="max-w-7xl mx-auto px-6 relative text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sec-label justify-center"
                >
                  🏫 Shalom Hills International School
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-7xl md:text-9xl font-display leading-[0.9] mb-6"
                >
                  UCSF<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-maple to-white">2026</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-ui text-lg md:text-xl font-bold uppercase tracking-[0.4em] text-white/60 mb-4"
                >
                  Union of Culture & Sports Fest
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-ui text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-12"
                >
                  Where Dynasties Rise · Legends Are Born · April 2026
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <button onClick={() => setActiveTab('home')} className="btn-primary">Live Standings</button>
                  <button onClick={() => setActiveTab('matches')} className="btn-ghost">View Fixtures</button>
                  <button onClick={() => setActiveTab('schedule')} className="btn-ghost">Full Schedule</button>
                </motion.div>
              </div>
            </section>

            {/* HOUSES */}
            <section className="py-24 bg-bg-dark">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                  <p className="sec-label">The Dynasties</p>
                  <h2 className="text-5xl md:text-6xl mb-4">Four Houses.<br />One Crown.</h2>
                  <p className="text-white/40 max-w-xl">Each house carries the spirit, pride, and legacy of its warriors.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {houses.map((house) => (
                    <HouseCard key={house.id} house={house} isTop={house.rank_pos === 1} />
                  ))}
                </div>
              </div>
            </section>

            {/* SCOREBOARD */}
            <section id="scoreboard" className="py-24 bg-bg-card border-y border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                  <p className="sec-label">Live Standings</p>
                  <h2 className="text-5xl md:text-6xl">The Leaderboard</h2>
                </div>
                
                <div className="card-glass overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 font-ui text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <th className="px-8 py-6">#</th>
                          <th className="px-8 py-6">Dynasty</th>
                          <th className="px-8 py-6 text-center">Points</th>
                          <th className="px-8 py-6 text-right">Motto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {houses.map((house) => (
                          <tr key={house.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-6">
                              <span className={cn(
                                "font-display text-2xl",
                                house.rank_pos === 1 ? "text-maple" : "text-white/60"
                              )}>
                                {house.rank_pos.toString().padStart(2, '0')}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: house.color + '20', color: house.color }}>
                                  {house.mascot}
                                </div>
                                <span className="font-display text-2xl tracking-wide">{house.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <span className="font-display text-3xl text-maple">{house.points}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">
                                {house.motto}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* ABOUT */}
            <section className="py-24 bg-bg-dark">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-24 items-start">
                  <div>
                    <p className="sec-label">The Festival</p>
                    <h2 className="text-5xl md:text-6xl mb-8">What Is UCSF?</h2>
                    <p className="text-white/60 mb-6 leading-relaxed">
                      The <strong className="text-white">Union of Culture & Sports Fest</strong> is the premier inter-school championship hosted by Shalom Hills International School.
                    </p>
                    <p className="text-white/60 mb-12 leading-relaxed">
                      Four legendary houses — Maple, Cedar, Ebony, and Oak — battle across disciplines, each vying for the ultimate crown and the glory of their dynasty.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: '4', label: 'Dynasties' },
                        { val: '3', label: 'Sports' },
                        { val: '6', label: 'Matches' },
                        { val: '1', label: 'Champion' },
                      ].map((stat, i) => (
                        <div key={i} className="card-glass p-8 text-center">
                          <div className="font-display text-5xl text-maple leading-none mb-2">{stat.val}</div>
                          <div className="font-ui text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="sec-label">Events</p>
                    <h2 className="text-5xl md:text-6xl mb-8">The Battlegrounds</h2>
                    <div className="space-y-4">
                      {schedule.slice(0, 5).map((item) => (
                        <div key={item.id} className="card-glass p-6 flex items-center justify-between group hover:border-maple/30 transition-all">
                          <div>
                            <h4 className="font-display text-xl tracking-wide mb-1">{item.title}</h4>
                            <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-white/40">{item.venue}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-ui text-xs font-bold text-maple mb-1">{item.time_start}</div>
                            <div className={cn(
                              "text-[10px] font-bold uppercase tracking-widest",
                              item.status === 'live' ? "text-red-500" : "text-white/20"
                            )}>
                              {item.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className="mt-8 font-ui text-xs font-bold uppercase tracking-widest text-maple flex items-center gap-2 hover:gap-4 transition-all"
                    >
                      View Full Schedule <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'schedule':
        const days = Array.from(new Set(schedule.map(s => s.day_label)));
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16">
              <p className="sec-label">Event Schedule</p>
              <h2 className="text-6xl md:text-7xl">The Timeline</h2>
            </div>
            
            <div className="space-y-24">
              {days.map(day => (
                <div key={day} className="space-y-12">
                  <div className="flex items-end gap-4 border-b border-white/5 pb-4">
                    <h3 className="text-4xl text-maple">{day}</h3>
                    <span className="font-ui text-sm font-bold uppercase tracking-widest text-white/20 mb-1">
                      {schedule.find(s => s.day_label === day)?.day_date}
                    </span>
                  </div>
                  <div className="grid gap-6">
                    {schedule.filter(s => s.day_label === day).map(item => (
                      <ScheduleCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matches':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16">
              <p className="sec-label">Fixtures & Results</p>
              <h2 className="text-6xl md:text-7xl">Match Schedule</h2>
              <p className="text-white/40 mt-4">Browse results by sport. Auto-refreshes every 30s.</p>
            </div>

            <div className="space-y-24">
              {categories.map(cat => (
                <section key={cat.id} className="space-y-12">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <span className="text-4xl">{cat.icon}</span>
                    <h3 className="text-4xl tracking-wider">{cat.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.filter(m => m.category_id === cat.id).map(match => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title={settings.fest_title || 'UCSF 2026'}
      subtitle={settings.fest_subtitle || 'Union of Culture & Sports Fest'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
