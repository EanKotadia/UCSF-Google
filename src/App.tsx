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
          <div className="space-y-0 bg-bg">
             <section className="relative py-40 md:py-60 flex flex-col items-center justify-center text-center px-6">
              <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em]">Annual Fest 2026</p>
                  <h1 className="text-7xl md:text-9xl font-display uppercase tracking-tight text-text leading-none">
                     UNION OF <span className="block text-primary">CULTURE & SPORTS</span>
                  </h1>
                </motion.div>

                <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.3, duration: 0.6 }}
                   className="text-text-muted font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                >
                   {festivalSubtitle}
                </motion.p>

                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5, duration: 0.6 }}
                   className="flex flex-wrap justify-center gap-6 pt-4"
                >
                   <button
                     onClick={() => setActiveTab('events')}
                     className="px-10 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-widest transition-all hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/20"
                   >
                      View Events
                   </button>
                   <button
                     onClick={() => setActiveTab('leaderboards')}
                     className="px-10 py-4 bg-white text-text border border-border rounded-full font-bold uppercase tracking-widest transition-all hover:bg-bg-alt hover:border-primary/30"
                   >
                      Standings
                   </button>
                </motion.div>
              </div>
            </section>

            <section className="py-32 border-t border-border bg-bg-alt">
               <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 font-ui">
                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">The Arena</p>
                           <h2 className="text-4xl font-display uppercase tracking-tight text-text">Grand Standings</h2>
                        </div>
                        <Trophy className="text-accent" size={32} />
                     </div>
                     <div className="space-y-4">
                        {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                          <div key={h.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-border group hover:border-primary/20 hover:shadow-lg transition-all cursor-default">
                             <div className="flex items-center gap-6">
                                <span className={cn(
                                   "w-12 h-12 rounded-2xl flex items-center justify-center font-display text-xl transition-all",
                                   i === 0 ? "bg-accent text-text" : "bg-bg-alt text-text-muted"
                                )}>#{i+1}</span>
                                <span className="font-bold uppercase tracking-widest text-lg text-text">{h.name}</span>
                             </div>
                             <span className="font-display text-3xl text-primary">{h.points}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-green-600 uppercase tracking-[0.3em]">Real-time Updates</p>
                           <h2 className="text-4xl font-display uppercase tracking-tight text-text">Live Action</h2>
                        </div>
                        <Activity className="text-green-600" size={32} />
                     </div>
                     <div className="space-y-4 min-h-[400px]">
                        {matches.filter(m => m.status === 'live').map(m => (
                          <div key={m.id} className="p-8 bg-white border border-border rounded-[2.5rem] relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                             <div className="absolute top-0 right-0 p-5">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                                   <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest">Live</span>
                                </div>
                             </div>
                             <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-6">
                                {categories.find(c => c.id === m.category_id)?.name} • {m.venue || 'Main Field'}
                             </p>
                             <div className="flex justify-between items-center gap-4">
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-2 text-text">{houses.find(h => h.id === m.team1_id)?.name}</p>
                                   <p className="text-4xl font-display text-primary">{m.score1}</p>
                                </div>
                                <div className="px-6 text-border font-display text-xl">VS</div>
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-2 text-text">{houses.find(h => h.id === m.team2_id)?.name}</p>
                                   <p className="text-4xl font-display text-primary">{m.score2}</p>
                                </div>
                             </div>
                          </div>
                        ))}
                        {matches.filter(m => m.status === 'live').length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-text-muted/20 border-2 border-dashed border-border rounded-[2.5rem] py-20">
                             <Activity size={48} className="mb-4 opacity-5" />
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
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Official Standings</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Championship</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                   <div key={h.id} className="bg-white border border-border rounded-[3rem] p-12 flex flex-col items-center text-center gap-10 group hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5">
                      <div className="w-24 h-24 bg-primary-muted rounded-[2rem] flex items-center justify-center text-4xl font-display text-primary transition-transform group-hover:scale-110">
                         #{i+1}
                      </div>
                      <h3 className="text-3xl font-display uppercase leading-tight text-text">{h.name}</h3>
                      <div className="w-full pt-10 border-t border-border">
                         <span className="text-6xl font-display text-primary">{h.points}</span>
                         <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.3em] mt-4">Total Points</p>
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
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Live Updates</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Bulletin</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="space-y-8">
                {notices.map(notice => (
                   <div key={notice.id} className="bg-white border border-border rounded-[2.5rem] p-12 space-y-6 relative overflow-hidden group shadow-sm">
                      <div className="absolute top-0 right-0 p-10">
                         <span className={cn(
                            "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            notice.priority === 'high' ? "bg-red-50 text-red-600 border border-red-100" : "bg-bg-alt text-text-muted border border-border"
                         )}>{notice.priority}</span>
                      </div>
                      <h3 className="text-3xl font-display uppercase tracking-tight pr-24 text-text">{notice.title}</h3>
                      <p className="text-text-muted text-lg leading-relaxed">{notice.content}</p>
                      <div className="pt-8 border-t border-border flex items-center gap-4 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                         <Calendar size={14} className="text-primary" />
                         {new Date(notice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                   </div>
                ))}
                {notices.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-32 text-text-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                      <Bell size={60} className="mb-6 opacity-5" />
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
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Captured</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Moments</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map(item => (
                   <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-bg-alt border border-border">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-50" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12 translate-y-4 group-hover:translate-y-0">
                         <p className="text-accent font-bold uppercase tracking-[0.2em] text-[11px] mb-3">{item.type || 'Event Photo'}</p>
                         <h4 className="text-3xl font-display uppercase tracking-tight text-white">{item.title}</h4>
                      </div>
                   </div>
                ))}
                {gallery.length === 0 && (
                   <div className="col-span-full flex flex-col items-center justify-center py-32 text-text-muted/20 border-2 border-dashed border-border rounded-[2.5rem]">
                      <Camera size={60} className="mb-6 opacity-5" />
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
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Timeline</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Schedule</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="space-y-6">
                {schedule.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(item => (
                   <div key={item.id} className="bg-white border border-border rounded-3xl p-10 flex flex-col md:flex-row md:items-center gap-10 group hover:border-primary/20 transition-all shadow-sm">
                      <div className="md:w-40 flex flex-col border-l-4 border-primary pl-6 py-2">
                         <span className="text-primary font-display text-3xl">{item.time_start?.slice(0, 5)}</span>
                         <span className="text-text-muted text-[11px] font-bold uppercase tracking-widest mt-1">{item.day_label}</span>
                      </div>
                      <div className="flex-grow">
                         <h3 className="text-3xl font-display uppercase tracking-tight mb-2 text-text">{item.title}</h3>
                         <p className="text-text-muted text-[12px] font-bold uppercase tracking-widest">{item.venue} • {item.subtitle}</p>
                      </div>
                      <div>
                         <span className={cn(
                            "px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border",
                            item.status === 'live' ? "bg-green-50 text-green-600 border-green-100" :
                            item.status === 'completed' ? "bg-bg-alt text-text-muted border-border" : "bg-primary-muted text-primary border-primary/10"
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
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">The Fest</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">About UCSF</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="space-y-12">
                <div className="bg-white border border-border rounded-[3rem] p-16 shadow-sm">
                   <h3 className="text-4xl font-display uppercase tracking-tight mb-8 text-text">Vision</h3>
                   <p className="text-text-muted text-xl leading-relaxed mb-8">
                      The Union of Culture & Sports Fest (UCSF) is a celebration of talent, resilience, and unity. It brings together athletes and performers to showcase excellence on and off the field.
                   </p>
                   <p className="text-text-muted text-xl leading-relaxed">
                      Our goal is to foster spirit, sportsmanship, and creativity among our community, creating memories that last a lifetime.
                   </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-white border border-border rounded-[2.5rem] p-12">
                      <Trophy className="text-primary mb-8" size={40} />
                      <h4 className="text-2xl font-display uppercase tracking-tight mb-4 text-text">Sports</h4>
                      <p className="text-text-muted text-sm leading-relaxed">Competitive athletics ranging from football to track events, emphasizing teamwork and fair play.</p>
                   </div>
                   <div className="bg-white border border-border rounded-[2.5rem] p-12">
                      <Users className="text-primary mb-8" size={40} />
                      <h4 className="text-2xl font-display uppercase tracking-tight mb-4 text-text">Culture</h4>
                      <p className="text-text-muted text-sm leading-relaxed">A platform for dance, music, drama, and fine arts to celebrate our diverse cultural heritage.</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'sponsors':
        return (
          <div className="max-w-5xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <p className="text-[12px] font-bold text-primary uppercase tracking-[0.5em] mb-4">Partners</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Sponsors</h2>
                <div className="h-1 w-20 bg-accent rounded-full" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-video bg-white border border-border rounded-3xl flex items-center justify-center p-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default hover:shadow-xl hover:shadow-primary/5">
                      <div className="text-center">
                         <div className="w-14 h-14 bg-bg-alt rounded-full mx-auto mb-4" />
                         <div className="h-2 w-28 bg-bg-alt rounded-full mx-auto" />
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-center text-text-muted/40 uppercase text-[11px] tracking-[0.4em] mt-32 font-bold">Contact us for sponsorship opportunities.</p>
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
