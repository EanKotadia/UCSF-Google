import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Activity, Trophy, Calendar, Users, Camera, Bell, Info } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useUCSFData } from './hooks/useUCSFData';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import EventsSection from './components/EventsSection';
import SupabaseConfig from './components/SupabaseConfig';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isConfigured, setIsConfigured] = useState(false);
  const {
    houses,
    matches,
    categories,
    notices,
    gallery,
    culturalResults,
    schedule,
    stagedChanges,
    settings,
    loading,
    refresh
  } = useUCSFData();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkConfig = () => {
      const url = localStorage.getItem('SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL;
      const key = localStorage.getItem('SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY;
      setIsConfigured(!!(url && key));
    };
    checkConfig();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setProfile(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setProfile(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isConfigured) {
    return <SupabaseConfig onConfigured={() => setIsConfigured(true)} />;
  }

  const festivalName = settings['festival_name'] || 'UCSF 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Celebrating athletic excellence and cultural diversity through competitive spirit.';
  const schoolLogoUrl = settings['school_logo_url'];
  const announcement = settings['announcement_text'];

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return (
          <AdminPanel
            matches={matches}
            houses={houses}
            schedule={schedule}
            categories={categories}
            notices={notices}
            gallery={gallery}
            culturalResults={culturalResults}
            stagedChanges={stagedChanges}
            profile={profile}
            settings={settings}
            refresh={refresh}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'events':
        return <EventsSection categories={categories} matches={matches} setActiveTab={(t: any) => setActiveTab(t)} />;
      case 'home':
        return (
          <div className="space-y-0">
             <section className="relative py-40 md:py-60 flex flex-col items-center justify-center text-center px-6">
              <div className="absolute inset-0 z-0 opacity-10">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent blur-[120px] rounded-full" />
              </div>

              <div className="max-w-5xl mx-auto space-y-10 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="hero-eyebrow">Annual Fest 2026</span>
                  <h1 className="hero-title">
                     UNION OF <span className="block text-accent">CULTURE & SPORTS</span>
                  </h1>
                  <p className="hero-sub">{festivalSubtitle}</p>
                </motion.div>

                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5, duration: 0.8 }}
                   className="flex flex-wrap justify-center gap-6 pt-6"
                >
                   <button
                     onClick={() => setActiveTab('events')}
                     className="btn-primary"
                   >
                      Explore Events <ChevronRight size={16} />
                   </button>
                   <button
                     onClick={() => setActiveTab('leaderboards')}
                     className="btn-ghost"
                   >
                      Live Rankings
                   </button>
                </motion.div>
              </div>
            </section>

            <section className="py-32 border-t border-border bg-bg-dark/50">
               <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 font-ui">
                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="sec-label mb-0">The Grand Standings</div>
                        <Trophy className="text-accent/40" size={24} />
                     </div>
                     <div className="card-glass p-8 space-y-4">
                        {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                          <div key={h.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-accent/30 transition-all cursor-default">
                             <div className="flex items-center gap-6">
                                <span className={cn(
                                   "w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl transition-all",
                                   i === 0 ? "bg-accent text-bg" : "bg-white/5 text-muted"
                                )}>#{i+1}</span>
                                <span className="font-bold uppercase tracking-widest text-lg text-text">{h.name}</span>
                             </div>
                             <span className="font-display text-3xl text-accent group-hover:scale-110 transition-transform">{h.points}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="sec-label mb-0">Live Action Feed</div>
                        <Activity className="text-danger/40" size={24} />
                     </div>
                     <div className="space-y-4 min-h-[400px]">
                        {matches.filter(m => m.status === 'live').map(m => (
                          <div key={m.id} className="card-glass p-8 relative overflow-hidden group shadow-lg">
                             <div className="absolute top-0 right-0 p-5">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-danger rounded-full animate-pulse" />
                                   <span className="badge badge-live">Live</span>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-6">
                                {categories.find(c => c.id === m.category_id)?.name} • {m.venue || 'Main Field'}
                             </p>
                             <div className="flex justify-between items-center gap-4">
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-2 text-text">{houses.find(h => h.id === m.team1_id)?.name}</p>
                                   <p className="text-4xl font-display text-accent">{m.score1}</p>
                                </div>
                                <div className="px-6 text-subtle font-display text-xl">:</div>
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-2 text-text">{houses.find(h => h.id === m.team2_id)?.name}</p>
                                   <p className="text-4xl font-display text-accent">{m.score2}</p>
                                </div>
                             </div>
                          </div>
                        ))}
                        {matches.filter(m => m.status === 'live').length === 0 && (
                          <div className="card-glass border-dashed flex flex-col items-center justify-center h-full py-20 text-muted">
                             <Activity size={48} className="mb-4 opacity-10" />
                             <p className="italic uppercase text-[11px] tracking-[0.4em] font-bold">Waiting for next event</p>
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </section>
          </div>
        );
      case 'leaderboards':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">Official Standings</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Championship</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                   <div key={h.id} className="card-glass p-10 flex flex-col items-center text-center gap-10 group hover:border-accent/40 transition-all">
                      <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-4xl font-display text-accent border border-accent/20 transition-transform group-hover:scale-110">
                         #{i+1}
                      </div>
                      <h3 className="text-3xl font-display uppercase leading-tight text-text">{h.name}</h3>
                      <div className="w-full pt-10 border-t border-border">
                         <span className="text-6xl font-display text-accent">{h.points}</span>
                         <p className="text-[11px] font-bold text-muted uppercase tracking-[0.3em] mt-4">Total Points</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'notices':
        return (
          <div className="max-w-4xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">Live Updates</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Bulletin</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="space-y-8">
                {notices.map(notice => (
                   <div key={notice.id} className="card-glass p-12 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10">
                         <span className={cn(
                            "badge",
                            notice.priority === 'high' ? "badge-live" : "badge-upcoming"
                         )}>{notice.priority}</span>
                      </div>
                      <h3 className="text-3xl font-display uppercase tracking-tight pr-24 text-text">{notice.title}</h3>
                      <p className="text-muted text-lg leading-relaxed">{notice.content}</p>
                      <div className="pt-8 border-t border-border flex items-center gap-4 text-[11px] text-muted font-bold uppercase tracking-widest">
                         <Calendar size={14} className="text-accent" />
                         {new Date(notice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                   </div>
                ))}
                {notices.length === 0 && (
                   <div className="card-glass border-dashed flex flex-col items-center justify-center py-32 text-muted">
                      <Bell size={60} className="mb-6 opacity-10" />
                      <p className="italic uppercase text-sm tracking-[0.4em] font-bold">No announcements yet</p>
                   </div>
                )}
             </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">Captured</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Moments</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map(item => (
                   <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-bg2 border border-border">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-50" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12 translate-y-4 group-hover:translate-y-0">
                         <p className="text-accent font-bold uppercase tracking-[0.2em] text-[11px] mb-3">{item.type || 'Event Photo'}</p>
                         <h4 className="text-3xl font-display uppercase tracking-tight text-white">{item.title}</h4>
                      </div>
                   </div>
                ))}
                {gallery.length === 0 && (
                   <div className="col-span-full card-glass border-dashed flex flex-col items-center justify-center py-32 text-muted">
                      <Camera size={60} className="mb-6 opacity-10" />
                      <p className="italic uppercase text-sm tracking-[0.4em] font-bold">Curating gallery...</p>
                   </div>
                )}
             </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="max-w-5xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">Timeline</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Schedule</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="space-y-6">
                {schedule.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(item => (
                   <div key={item.id} className="card-glass p-10 flex flex-col md:flex-row md:items-center gap-10 group hover:border-accent/30 transition-all shadow-xl">
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
                      <div>
                         <span className={cn(
                            "badge",
                            item.status === 'live' ? "badge-live" :
                            item.status === 'completed' ? "badge-completed" : "badge-upcoming"
                         )}>{item.status === 'live' ? 'In Progress' : item.status}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">The Fest</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">About UCSF</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="space-y-12">
                <div className="card-glass p-16 shadow-2xl">
                   <h3 className="text-4xl font-display uppercase tracking-tight mb-8 text-text">Vision</h3>
                   <p className="text-muted text-xl leading-relaxed mb-8">
                      The Union of Culture & Sports Fest (UCSF) is a celebration of talent, resilience, and unity. It brings together athletes and performers to showcase excellence on and off the field.
                   </p>
                   <p className="text-muted text-xl leading-relaxed">
                      Our goal is to foster spirit, sportsmanship, and creativity among our community, creating memories that last a lifetime.
                   </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="card-glass p-12">
                      <Trophy className="text-accent mb-8" size={48} />
                      <h4 className="text-3xl font-display uppercase tracking-tight mb-4 text-text">Sports</h4>
                      <p className="text-muted text-sm leading-relaxed">Competitive athletics ranging from football to track events, emphasizing teamwork and fair play.</p>
                   </div>
                   <div className="card-glass p-12">
                      <Users className="text-accent mb-8" size={48} />
                      <h4 className="text-3xl font-display uppercase tracking-tight mb-4 text-text">Culture</h4>
                      <p className="text-muted text-sm leading-relaxed">A platform for dance, music, drama, and fine arts to celebrate our diverse cultural heritage.</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'sponsors':
        return (
          <div className="max-w-5xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">Partners</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Sponsors</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-video bg-white/5 border border-border rounded-3xl flex items-center justify-center p-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default hover:border-accent/20">
                      <div className="text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4" />
                         <div className="h-2 w-32 bg-white/5 rounded-full mx-auto" />
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-center text-subtle uppercase text-[11px] tracking-[0.4em] mt-32 font-bold">Contact us for sponsorship opportunities.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(t: any) => setActiveTab(t)}
      title={festivalName}
      subtitle={festivalSubtitle}
      schoolLogoUrl={schoolLogoUrl}
      announcement={announcement}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
