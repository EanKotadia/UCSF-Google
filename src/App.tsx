import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import { useUCSFData } from './hooks/useUCSFData';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Calendar,
  Shield,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Info,
  FileText,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const isAdminOnly = import.meta.env.VITE_ADMIN_ONLY === "true";
  const [activeTab, setActiveTab] = useState('home');
  const {
    committees,
    members,
    rankings,

    schedule,
    settings,
    profile,
    loading,
    error,
    refresh
  } = useUCSFData();

  const getStatus = (item: any) => {
    const now = new Date();
    const [h, m] = (item.time_start || '00:00').split(':').map(Number);
    const [eh, em] = (item.time_end || '23:59').split(':').map(Number);

    const start = new Date(); start.setHours(h, m, 0);
    const end = new Date(); end.setHours(eh, em, 0);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'live';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] gap-6">
        <div className="w-16 h-16 border-4 border-maple/20 border-t-maple rounded-full animate-spin" />
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-maple">Harmonia MUN 2026...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-display text-white mb-2">Connection Error</h2>
        <p className="text-white/40 mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  if (isAdminOnly) return (
    <AdminPanel
      schedule={schedule}
      committees={committees}
      rankings={rankings}
      members={members}
      profile={profile}
      settings={settings}
      refresh={refresh}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-0">
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
              <div className="absolute inset-0 bg-gradient-to-b from-[#050b1a]/50 via-[#050b1a] to-[#050b1a]" />
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
                  <div className="px-4 py-1 border border-maple/30 rounded-full bg-maple/5 backdrop-blur-sm">
                    <span className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-maple">
                      {settings['festival_dates'] || 'October 24-26, 2026'}
                    </span>
                  </div>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-8xl font-display text-white mb-6 uppercase tracking-tighter">
                  Harmonia <span className="text-maple">MUN</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
                  Shalom Hills International Conference 2026. Empowering the leaders of tomorrow through diplomacy and debate.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-6">
                  <button onClick={() => setActiveTab('committees')} className="btn-primary flex items-center gap-2">
                    View Committees <ChevronRight size={18} />
                  </button>
                  <button onClick={() => setActiveTab('schedule')} className="btn-ghost">Schedule</button>
                </motion.div>
              </div>
            </section>
            <section className="py-24 border-y border-white/5 bg-[#081021]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                  {[{ label: 'Committees', val: committees.length }, { label: 'Delegates', val: '300+' }, { label: 'Awards', val: '25+' }, { label: 'Schools', val: '15+' }].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl md:text-6xl font-display text-white mb-2">{stat.val}</div>
                      <div className="font-ui text-[10px] font-bold uppercase tracking-widest text-maple">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 flex items-center justify-between">
                  <h2 className="text-4xl font-display text-white uppercase tracking-tight">Event Flow</h2>
                  <button onClick={() => setActiveTab('schedule')} className="text-maple font-ui text-xs font-bold uppercase tracking-widest">Full Schedule</button>
                </div>
                <div className="space-y-4">
                  {schedule.slice(0, 4).map((item) => {
                    const status = getStatus(item);
                    return (
                      <div key={item.id} className="card-glass p-6 flex flex-col md:flex-row md:items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <div className="text-center min-w-[80px]">
                            <div className="text-xl font-display text-white">{item.time_start}</div>
                            <div className="text-[10px] text-white/30 uppercase font-bold">{item.day_label}</div>
                          </div>
                          <div>
                            <h4 className="text-xl font-display text-white">{item.title}</h4>
                            <div className="text-white/40 text-xs">{item.venue}</div>
                          </div>
                        </div>
                        <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border", status === 'live' ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-maple/10 text-maple")}>{status}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="grid lg:grid-cols-2 gap-24">
              <div>
                <p className="sec-label">The Conference</p>
                <h2 className="text-6xl font-display text-white uppercase tracking-tighter mb-12">About Harmonia</h2>
                <p className="text-white/60 text-lg leading-relaxed">Harmonia MUN 2026 is Shalom Hills International School flagship diplomatic conference. We seek to find common ground through dialogue and empathy.</p>
              </div>
              <div className="card-glass p-12">
                <h3 className="text-3xl font-display text-white uppercase mb-6">Our Mission</h3>
                <p className="text-white/60 leading-relaxed">To foster a new generation of leaders who prioritize collective problem-solving and diplomatic excellence.</p>
              </div>
            </div>
          </div>
        );
      case 'committees':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <h2 className="text-6xl md:text-8xl font-display text-white uppercase tracking-tighter mb-20">Committees</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {committees.map((c) => (
                <motion.div key={c.id} className="card-glass p-8 flex flex-col h-full">
                  <h3 className="text-3xl font-display text-white mb-4 uppercase">{c.name}</h3>
                  <p className="text-white/50 mb-8 flex-1">{c.description}</p>
                  {c.bg_guide_url && <a href={c.bg_guide_url} className="btn-ghost text-center">Background Guide</a>}
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'oc':
        const roles = ['Director', "Charge d'Affaires", 'Navigator'];
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <h2 className="text-6xl font-display text-white uppercase text-center mb-20">Organizing Committee</h2>
            {roles.map(role => (
              <div key={role} className="mb-20">
                <h3 className="text-2xl font-display text-maple uppercase mb-10">{role}s</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {members.filter(m => m.category === role).map(m => (
                    <div key={m.id} className="text-center">
                      <div className="aspect-square bg-white/5 rounded-3xl mb-4" />
                      <h4 className="text-xl font-display text-white">{m.name}</h4>
                      <p className="text-maple text-[10px] font-bold uppercase">{m.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'schedule':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <h2 className="text-6xl font-display text-white uppercase mb-20">The Flow</h2>
            <div className="space-y-8">
              {schedule.map(item => (
                <div key={item.id} className="card-glass p-8 flex justify-between">
                  <div>
                    <div className="text-2xl font-display text-white">{item.time_start}</div>
                    <div className="text-white/30 uppercase text-[10px]">{item.day_label}</div>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xl font-display text-white">{item.title}</h4>
                    <p className="text-white/40">{item.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'rankings':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <h2 className="text-6xl font-display text-white uppercase mb-20">Leaderboards</h2>
            <div className="space-y-4">
              {rankings.map((r, i) => (
                <div key={r.id} className="card-glass p-6 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="text-3xl font-display text-maple/30">#{i+1}</div>
                    <div>
                      <h3 className="text-xl font-display text-white">{r.delegate_name}</h3>
                      <p className="text-white/40 text-[10px]">{r.school}</p>
                    </div>
                  </div>
                  <div className="bg-maple text-bg px-4 py-1 rounded-full text-[10px] font-bold">{r.award}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title="Harmonia MUN"
      subtitle="Shalom Hills International Conference"
      announcement={settings['announcement_text']}
      schoolLogoUrl="https://www.shalomhills.com/images/logo.png"
      profile={profile}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
