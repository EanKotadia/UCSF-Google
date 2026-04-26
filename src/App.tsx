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

  const festivalName = settings['festival_name'] || 'Harmonia MUN 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Celebrating diplomatic excellence and exceptional contribution to the conference.';
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
      case 'committees':
        return <EventsSection categories={categories} matches={matches} setActiveTab={(t: any) => setActiveTab(t)} />;
      case 'home':
        return (
          <div className="space-y-0">
             <section className="relative py-32 md:py-48 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center font-ui">
                <div className="mb-6 flex flex-col items-center gap-2">
                   <div className="h-px w-12 bg-gold/50 mb-2" />
                   <p className="text-[10px] font-bold text-gold uppercase tracking-[0.4em]">Hall of Fame</p>
                </div>
                <h1 className="text-6xl md:text-9xl font-display uppercase tracking-tight mb-8 leading-none">
                   CONFERENCE <span className="block">AWARDS</span>
                </h1>
                <p className="text-white/60 font-medium text-lg md:text-xl max-w-2xl mx-auto mb-16 leading-relaxed">
                   {festivalSubtitle}
                </p>

                <div className="bg-bg2/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-12 md:p-24 min-h-[400px] flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg/20" />
                   <div className="relative z-10 flex flex-col items-center gap-6">
                      <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20">
                         <Trophy size={32} />
                      </div>
                      <p className="italic uppercase text-[11px] tracking-[0.3em] text-white/40">Awards will be announced following the closing ceremony.</p>
                   </div>
                </div>
              </div>
            </section>

            <section className="py-24 border-t border-white/5">
               <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 font-ui">
                  <div className="bg-bg2/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 space-y-8">
                     <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-display uppercase tracking-tight">The Grand Standings</h2>
                        <Trophy className="text-gold" size={24} />
                     </div>
                     <div className="space-y-4">
                        {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                          <div key={h.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-gold/30 transition-all cursor-default">
                             <div className="flex items-center gap-6">
                                <span className="text-gold font-display text-3xl opacity-40 group-hover:opacity-100 transition-opacity">#{i+1}</span>
                                <span className="font-bold uppercase tracking-widest text-lg">{h.name}</span>
                             </div>
                             <span className="font-display text-3xl text-white">{h.points}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-bg2/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 space-y-8">
                     <div className="flex items-center justify-between">
                        <h2 className="text-4xl font-display uppercase tracking-tight">Live Feed</h2>
                        <Activity className="text-green-500" size={24} />
                     </div>
                     <div className="space-y-4 h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {matches.filter(m => m.status === 'live').map(m => (
                          <div key={m.id} className="p-8 bg-green-500/5 border border-green-500/20 rounded-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-3">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                   <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Live Now</span>
                                </div>
                             </div>
                             <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
                                {categories.find(c => c.id === m.category_id)?.name} • {m.venue || 'Main Hall'}
                             </p>
                             <div className="flex justify-between items-center">
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-1">{houses.find(h => h.id === m.team1_id)?.name}</p>
                                   <p className="text-3xl font-display text-white">{m.score1}</p>
                                </div>
                                <div className="px-6 text-white/20 font-display">VS</div>
                                <div className="text-center flex-1">
                                   <p className="font-bold uppercase tracking-widest text-sm mb-1">{houses.find(h => h.id === m.team2_id)?.name}</p>
                                   <p className="text-3xl font-display text-white">{m.score2}</p>
                                </div>
                             </div>
                          </div>
                        ))}
                        {matches.filter(m => m.status === 'live').length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-white/20">
                             <Activity size={32} className="mb-4 opacity-5" />
                             <p className="italic uppercase text-[10px] tracking-[0.3em]">No active sessions at the moment</p>
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
          <div className="max-w-7xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">Rankings</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Championship Standings</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                   <div key={h.id} className="bg-bg2/40 border border-white/5 backdrop-blur-xl rounded-[3rem] p-12 flex flex-col items-center text-center gap-8 group hover:border-gold/30 transition-all">
                      <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-4xl font-display text-gold border border-gold/20 shadow-2xl shadow-gold/5">
                         #{i+1}
                      </div>
                      <h3 className="text-3xl font-display uppercase leading-tight">{h.name}</h3>
                      <div className="w-full pt-8 border-t border-white/5">
                         <span className="text-6xl font-display text-white">{h.points}</span>
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-4">Total Merit Points</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'notices':
        return (
          <div className="max-w-4xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">Notices</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Official Announcements</p>
             </div>
             <div className="space-y-8">
                {notices.map(notice => (
                   <div key={notice.id} className="bg-bg2/40 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8">
                         <span className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            notice.priority === 'high' ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-gold/10 text-gold border border-gold/20"
                         )}>{notice.priority}</span>
                      </div>
                      <h3 className="text-3xl font-display uppercase tracking-tight pr-24">{notice.title}</h3>
                      <p className="text-white/60 text-lg leading-relaxed">{notice.content}</p>
                      <div className="pt-6 border-t border-white/5 flex items-center gap-4 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                         <Calendar size={12} />
                         {new Date(notice.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                   </div>
                ))}
                {notices.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-24 text-white/10">
                      <Bell size={48} className="mb-6 opacity-5" />
                      <p className="italic uppercase text-sm tracking-[0.4em]">No announcements at this time</p>
                   </div>
                )}
             </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">Gallery</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Captured Moments</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map(item => (
                   <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-bg2/40 border border-white/5">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                         <p className="text-gold font-bold uppercase tracking-[0.2em] text-[10px] mb-2">{item.type || 'Photograph'}</p>
                         <h4 className="text-2xl font-display uppercase tracking-tight">{item.title}</h4>
                      </div>
                   </div>
                ))}
                {gallery.length === 0 && (
                   <div className="col-span-full flex flex-col items-center justify-center py-24 text-white/10">
                      <Camera size={48} className="mb-6 opacity-5" />
                      <p className="italic uppercase text-sm tracking-[0.4em]">Gallery is being curated</p>
                   </div>
                )}
             </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="max-w-5xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">Schedule</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Event Timeline</p>
             </div>
             <div className="space-y-6">
                {schedule.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(item => (
                   <div key={item.id} className="bg-bg2/40 border border-white/5 backdrop-blur-xl rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:border-gold/20 transition-all">
                      <div className="md:w-32 flex flex-col">
                         <span className="text-gold font-display text-2xl">{item.time_start?.slice(0, 5)}</span>
                         <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{item.day_label}</span>
                      </div>
                      <div className="flex-grow">
                         <h3 className="text-2xl font-display uppercase tracking-tight mb-1">{item.title}</h3>
                         <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">{item.venue} • {item.subtitle}</p>
                      </div>
                      <div>
                         <span className={cn(
                            "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border",
                            item.status === 'live' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            item.status === 'completed' ? "bg-white/5 text-white/40 border-white/10" : "bg-gold/5 text-gold border-gold/20"
                         )}>{item.status === 'live' ? 'Live Now' : item.status}</span>
                      </div>
                   </div>
                ))}
                {schedule.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-24 text-white/10">
                      <Calendar size={48} className="mb-6 opacity-5" />
                      <p className="italic uppercase text-sm tracking-[0.4em]">Schedule will be released soon</p>
                   </div>
                )}
             </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">About</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Our Mission & Vision</p>
             </div>
             <div className="prose prose-invert max-w-none space-y-12">
                <div className="bg-bg2/40 border border-white/5 rounded-[3rem] p-12 md:p-16">
                   <h3 className="text-4xl font-display uppercase tracking-tight mb-8">The Conference</h3>
                   <p className="text-white/60 text-lg leading-relaxed mb-6">
                      Harmonia Model United Nations is a premier simulation of the UN, where students step into the shoes of diplomats to debate, negotiate, and solve some of the world's most pressing issues.
                   </p>
                   <p className="text-white/60 text-lg leading-relaxed">
                      Our mission is to foster a generation of empathetic, informed, and articulate leaders who understand the complexities of global governance and the power of collaboration.
                   </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="bg-bg2/40 border border-white/5 rounded-[2.5rem] p-10">
                      <Info className="text-gold mb-6" size={32} />
                      <h4 className="text-2xl font-display uppercase tracking-tight mb-4">Excellence</h4>
                      <p className="text-white/40 text-sm leading-relaxed">Promoting the highest standards of research, public speaking, and policy writing.</p>
                   </div>
                   <div className="bg-bg2/40 border border-white/5 rounded-[2.5rem] p-10">
                      <Users className="text-gold mb-6" size={32} />
                      <h4 className="text-2xl font-display uppercase tracking-tight mb-4">Inclusion</h4>
                      <p className="text-white/40 text-sm leading-relaxed">Creating a platform where every voice is heard and every perspective is valued.</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'sponsors':
        return (
          <div className="max-w-5xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="h-px w-12 bg-gold/50 mb-4" />
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight">Sponsors</h2>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-sm">Partners in Excellence</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
                {[1,2,3,4].map(i => (
                   <div key={i} className="aspect-video bg-bg2/40 border border-white/5 rounded-3xl flex items-center justify-center p-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <div className="text-center">
                         <div className="w-12 h-12 bg-white/5 rounded-full mx-auto mb-4" />
                         <div className="h-2 w-24 bg-white/10 rounded-full mx-auto" />
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-center text-white/20 uppercase text-[10px] tracking-[0.5em] mt-24">Interested in partnering? Contact the organizing committee.</p>
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
