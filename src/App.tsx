import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Activity,
  Calendar,
  Users,
  Bell,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Heart,
  LayoutGrid
} from 'lucide-react';
import { useUCSFData } from './hooks/useUCSFData';
import Layout from './components/Layout';
import EventsSection from './components/EventsSection';
import AdminPanel from './components/AdminPanel';
import { cn } from './lib/utils';

type Tab = 'home' | 'events' | 'leaderboards' | 'notices' | 'gallery' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const {
    houses,
    matches,
    schedule,
    categories,
    notices,
    gallery,
    culturalResults,
    stagedChanges,
    profile,
    settings,
    loading,
    error,
    refresh
  } = useUCSFData();

  if (loading && !houses.length) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-maple/20 border-t-maple rounded-full animate-spin" />
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] animate-pulse">Initializing UCSF System</p>
        </div>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'UCSF 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Union of Culture & Sports Fest';
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
             <section className="relative py-32 md:py-48 overflow-hidden border-b border-white/5">
              <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-maple/10 blur-[120px] rounded-full" />
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center font-ui">
                <div className="mb-8 flex justify-center">
                  <img src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"} alt="School Logo" className="h-20 md:h-24 object-contain" />
                </div>
                <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tight mb-6 leading-none">
                   {festivalName.split(' ')[0]} <span className="text-maple">{festivalName.split(' ')[1] || ''}</span>
                </h1>
                <p className="text-white/60 font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-12">{festivalSubtitle}</p>
                <div className="flex flex-wrap justify-center gap-4">
                   <button onClick={() => setActiveTab('events')} className="px-8 py-4 bg-maple hover:bg-maple/90 text-white rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-maple/20">
                      Explore Events <ChevronRight size={18} />
                   </button>
                   <button onClick={() => setActiveTab('leaderboards')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest border border-white/10 transition-all">
                      Live Rankings
                   </button>
                </div>
              </div>
            </section>

            <section className="py-24 bg-bg2/30">
               <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 font-ui">
                  <div className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 space-y-6">
                     <h2 className="text-4xl font-display uppercase">The Grand Standings</h2>
                     <div className="space-y-4">
                        {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                          <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                             <div className="flex items-center gap-4">
                                <span className="text-maple font-display text-2xl">#{i+1}</span>
                                <span className="font-bold uppercase tracking-wider">{h.name}</span>
                             </div>
                             <span className="font-display text-2xl text-white">{h.points}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-12 space-y-6">
                     <h2 className="text-4xl font-display uppercase">Live Feed</h2>
                     <div className="space-y-4">
                        {matches.filter(m => m.status === 'live').map(m => (
                          <div key={m.id} className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl animate-pulse">
                             <p className="text-[8px] font-bold text-green-500 uppercase tracking-[0.3em] mb-2">Live Now • {categories.find(c => c.id === m.category_id)?.name}</p>
                             <div className="flex justify-between items-center">
                                <span className="font-bold">{houses.find(h => h.id === m.team1_id)?.name}</span>
                                <span className="font-display text-xl">{m.score1} - {m.score2}</span>
                                <span className="font-bold">{houses.find(h => h.id === m.team2_id)?.name}</span>
                             </div>
                          </div>
                        ))}
                        {matches.filter(m => m.status === 'live').length === 0 && (
                          <div className="flex flex-col items-center justify-center py-12 text-white/20">
                             <Activity size={32} className="mb-4 opacity-5" />
                             <p className="italic uppercase text-[10px] tracking-widest">No active matches at the moment</p>
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
             <h2 className="text-5xl md:text-7xl font-display uppercase mb-12">Championship Standings</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                   <div key={h.id} className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col items-center text-center gap-6 group hover:border-maple/30 transition-all">
                      <div className="w-24 h-24 bg-maple/10 rounded-full flex items-center justify-center text-4xl font-display text-maple border border-maple/20">
                         #{i+1}
                      </div>
                      <h3 className="text-3xl font-display uppercase">{h.name}</h3>
                      <div className="w-full pt-6 border-t border-white/10">
                         <span className="text-5xl font-display text-white">{h.points}</span>
                         <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-2">Total Points</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );
      case 'notices':
        return (
          <div className="max-w-4xl mx-auto px-6 py-24 font-ui">
             <h2 className="text-5xl md:text-7xl font-display uppercase mb-12">Notices</h2>
             <div className="space-y-6">
                {notices.map(notice => (
                   <div key={notice.id} className="bg-white/5 border border-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <h3 className="text-2xl font-bold uppercase">{notice.title}</h3>
                         <span className={cn(
                            "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                            notice.priority === 'high' ? "bg-red-500/20 text-red-500" : "bg-maple/20 text-maple"
                         )}>{notice.priority}</span>
                      </div>
                      <p className="text-white/60 leading-relaxed">{notice.content}</p>
                      <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{new Date(notice.created_at).toLocaleDateString()}</p>
                   </div>
                ))}
                {notices.length === 0 && <p className="text-center text-white/20 py-12">No notices published yet.</p>}
             </div>
          </div>
        );
      case 'gallery':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24 font-ui">
             <h2 className="text-5xl md:text-7xl font-display uppercase mb-12">Gallery</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gallery.map(item => (
                   <div key={item.id} className="group relative aspect-square overflow-hidden rounded-[2rem] bg-white/5 border border-white/5">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                         <h4 className="text-lg font-bold uppercase">{item.title}</h4>
                      </div>
                   </div>
                ))}
                {gallery.length === 0 && <p className="col-span-full text-center text-white/20 py-12">The gallery is currently empty.</p>}
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
