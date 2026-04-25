import AdminPanel from './components/AdminPanel';
import SupabaseConfig from './components/SupabaseConfig';
import { configureSupabase, supabase } from './lib/supabase';
import React, { useState } from 'react';
import Layout from './components/Layout';
import EventsSection from './components/EventsSection';
import { useUCSFData } from './hooks/useUCSFData';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Calendar, Shield, AlertCircle, ChevronRight, ExternalLink, Bell } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  if (!supabase) return <SupabaseConfig onConfigured={configureSupabase} />;

  const [activeTab, setActiveTab] = useState('home');
  const { houses, matches, schedule, settings, categories, notices, gallery, culturalResults, stagedChanges, profile, loading, error, refresh } = useUCSFData();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] gap-6">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 animate-pulse">Loading UCSF 2026…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-3xl font-display text-white mb-4">Connection Error</h2>
        <p className="text-white/40 max-w-md mb-8">{error}</p>
        <button onClick={() => refresh()} className="px-8 py-4 bg-blue-600 rounded-2xl font-bold text-white uppercase tracking-widest">Retry Connection</button>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'UCSF 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Union of Culture & Sports Fest';
  const schoolLogoUrl = settings['school_logo_url'];

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
        return <EventsSection categories={categories} matches={matches} setActiveTab={setActiveTab} />;
      case 'home':
        return (
          <div className="space-y-0">
             <section className="relative py-32 md:py-48 overflow-hidden border-b border-white/5">
              <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="mb-8 flex justify-center">
                  <img src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"} alt="School Logo" className="h-20 md:h-24 object-contain" />
                </div>
                <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tight mb-6 leading-none">
                   {festivalName.split(' ')[0]} <span className="text-blue-500">{festivalName.split(' ')[1] || ''}</span>
                </h1>
                <p className="text-white/60 font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-12">{festivalSubtitle}</p>
                <div className="flex flex-wrap justify-center gap-4">
                   <button onClick={() => setActiveTab('events')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center gap-2">
                      Explore Events <ChevronRight size={18} />
                   </button>
                   <button onClick={() => setActiveTab('leaderboards')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold uppercase tracking-widest border border-white/10 transition-all">
                      Live Rankings
                   </button>
                </div>
              </div>
            </section>

            <section className="py-24 bg-[#0a1128]/30">
               <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                  <div className="card-glass p-12 space-y-6">
                     <h2 className="text-4xl font-display uppercase">The Grand Standings</h2>
                     <div className="space-y-4">
                        {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                          <div key={h.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                             <div className="flex items-center gap-4">
                                <span className="text-blue-500 font-display text-2xl">#{i+1}</span>
                                <span className="font-bold uppercase tracking-wider">{h.name}</span>
                             </div>
                             <span className="font-display text-2xl text-white">{h.points}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="card-glass p-12 space-y-6">
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
                          <p className="text-white/20 text-center py-12 italic">No active matches at the moment</p>
                        )}
                     </div>
                  </div>
               </div>
            </section>
          </div>
        );
      case 'leaderboards':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
             <h2 className="text-5xl md:text-7xl font-display uppercase mb-12">Championship Standings</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((h, i) => (
                   <div key={h.id} className="card-glass p-10 flex flex-col items-center text-center gap-6 group hover:border-blue-500/30 transition-all">
                      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-4xl font-display text-blue-500 border border-blue-500/20">
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
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title={festivalName}
      subtitle={festivalSubtitle}
      schoolLogoUrl={schoolLogoUrl}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
