import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Users, Calendar, Activity,
  Layers, Camera, Bell, Info, Shield,
  ChevronRight, Heart, Star, Sparkles,
  Award, Target, Rocket, Zap, X
} from 'lucide-react';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import { useUCSFData } from './hooks/useUCSFData';
import { cn } from './lib/utils';
import { supabase } from './lib/supabase';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const {
    houses, matches, schedule, settings,
    gallery, notices, culturalResults,
    loading, refresh
  } = useUCSFData();

  const [winner, setWinner] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebratedWinnerId, setLastCelebratedWinnerId] = useState<string | null>(null);

  // Sync winner from settings
  useEffect(() => {
    const winnerId = settings['winner_house_id'];
    if (winnerId && houses.length > 0) {
       if (winnerId !== lastCelebratedWinnerId) {
          const winningHouse = houses.find(h => h.id === winnerId);
          if (winningHouse) {
             setWinner(winningHouse);
             setShowCelebration(true);
             setLastCelebratedWinnerId(winnerId);
          }
       }
    } else if (!winnerId) {
       setWinner(null);
       setShowCelebration(false);
       setLastCelebratedWinnerId(null);
    }
  }, [settings, houses, lastCelebratedWinnerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center">
           <h1 className="nav-logo text-4xl mb-2">UCSF</h1>
           <p className="text-muted font-bold uppercase tracking-[0.5em] text-[10px]">Initializing Experience</p>
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
      case 'home':
        return (
          <div className="flex flex-col">
            <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 overflow-hidden">
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse" />
                  <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 40 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="text-center z-10 max-w-5xl"
               >
                  <div className="hero-eyebrow">The Ultimate Convergence</div>
                  <h1 className="hero-title mb-8">
                    EMPOWERING<br/>
                    <span className="text-accent">EXCELLENCE</span>
                  </h1>
                  <p className="hero-sub mb-16 mx-auto">
                    Where spirit meets skill and culture transcends boundaries.
                  </p>

                  <div className="flex flex-wrap justify-center gap-6">
                     <button onClick={() => setActiveTab('events')} className="btn-primary py-5 px-10 text-base">
                        Explore Events <ChevronRight size={20} />
                     </button>
                     <button onClick={() => setActiveTab('leaderboards')} className="btn-ghost py-5 px-10 text-base">
                        View Rankings
                     </button>
                  </div>
               </motion.div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-32 z-10 w-full max-w-6xl">
                  {[
                     { label: 'Athletes', val: '500+', icon: Target },
                     { label: 'Performers', val: '200+', icon: Heart },
                     { label: 'Events', val: '24', icon: Star },
                     { label: 'Prize Pool', val: '100K+', icon: Award }
                  ].map((s, i) => (
                     <div key={i} className="card-glass p-8 text-center group hover:border-accent/30 transition-all">
                        <s.icon size={24} className="text-accent/50 group-hover:text-accent mx-auto mb-4 transition-colors" />
                        <p className="text-3xl font-display text-text mb-1">{s.val}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{s.label}</p>
                     </div>
                  ))}
               </div>
            </section>
          </div>
        );

      case 'events':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">The Mainstage</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Live Events</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {matches.filter(m => m.status === 'live').map(match => (
                   <div key={match.id} className="card-glass p-12 border-l-4 border-l-danger relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8">
                         <span className="badge badge-live animate-pulse">Live Now</span>
                      </div>
                      <p className="text-accent font-bold uppercase tracking-[0.2em] text-[11px] mb-4">Round {match.match_no || 'X'}</p>
                      <h3 className="text-4xl font-display uppercase tracking-tight mb-8 text-text">{match.category_id?.replace(/-/g, ' ')}</h3>

                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <span className="text-muted font-bold text-sm tracking-widest uppercase">{match.team1_id}</span>
                            <span className="text-2xl font-display text-text">{match.score1 ?? '-'}</span>
                         </div>
                         <div className="h-px bg-white/5" />
                         <div className="flex items-center justify-between">
                            <span className="text-muted font-bold text-sm tracking-widest uppercase">{match.team2_id}</span>
                            <span className="text-2xl font-display text-text">{match.score2 ?? '-'}</span>
                         </div>
                      </div>
                      <div className="mt-10 flex items-center gap-3 text-subtle text-[11px] font-bold uppercase tracking-widest">
                         <Info size={14} /> {match.venue}
                      </div>
                   </div>
                ))}
                {matches.filter(m => m.status === 'live').length === 0 && (
                   <div className="col-span-full card-glass border-dashed flex flex-col items-center justify-center py-40 text-muted">
                      <Rocket size={60} className="mb-6 opacity-10" />
                      <p className="italic uppercase text-sm tracking-[0.4em] font-bold">No events currently live</p>
                   </div>
                )}
             </div>
          </div>
        );

      case 'leaderboards':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32 font-ui">
             <div className="flex flex-col items-center text-center mb-24">
                <div className="sec-label">House Standing</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-6 tracking-tight text-text">Rankings</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {houses.sort((a,b) => b.points - a.points).map((house, idx) => (
                   <div key={house.id} className="card-glass p-12 flex flex-col items-center group relative">
                      <div className="absolute top-0 left-0 p-8">
                         <span className="text-4xl font-display text-white/5 group-hover:text-accent/20 transition-colors">#0{idx + 1}</span>
                      </div>
                      <div
                         className="w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl relative"
                         style={{ backgroundColor: `${house.color}20`, border: `2px solid ${house.color}40` }}
                      >
                         <Shield size={48} style={{ color: house.color }} />
                         <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                      </div>
                      <h3 className="text-4xl font-display uppercase tracking-tight mb-2 text-text">{house.name}</h3>
                      <p className="text-muted font-bold uppercase tracking-[0.3em] text-[10px] mb-8">{house.mascot_name || 'Defender'}</p>

                      <div className="w-full space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Points</span>
                            <span className="text-4xl font-display text-accent leading-none">{house.points}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                               initial={{ width: 0 }}
                               animate={{ width: `${(house.points / 2000) * 100}%` }}
                               className="h-full bg-accent"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center">
                               <p className="text-[9px] font-bold text-subtle uppercase tracking-widest mb-1">Sports</p>
                               <p className="text-lg font-display text-text">{house.sports_points || 0}</p>
                            </div>
                            <div className="text-center border-l border-white/5">
                               <p className="text-[9px] font-bold text-subtle uppercase tracking-widest mb-1">Cultural</p>
                               <p className="text-lg font-display text-text">{house.cultural_points || 0}</p>
                            </div>
                         </div>
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
    <div className="min-h-screen bg-bg">
      {activeTab === 'admin' ? (
         <AdminPanel onBack={() => setActiveTab('home')} />
      ) : (
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
      )}

      {/* Winner Surprise Overlay */}
      <AnimatePresence>
        {showCelebration && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-bg/95 backdrop-blur-3xl overflow-hidden p-6"
          >
            <button
               onClick={() => setShowCelebration(false)}
               className="absolute top-8 right-8 p-4 text-muted hover:text-white transition-colors z-[1100]"
            >
               <X size={40} />
            </button>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -100, opacity: 1 }}
                    animate={{
                       y: 1200,
                       rotate: 360,
                       x: Math.random() * 100 - 50
                    }}
                    transition={{
                       duration: Math.random() * 3 + 2,
                       repeat: Infinity,
                       delay: Math.random() * 5
                    }}
                    className="absolute w-2 h-4 rounded-sm"
                    style={{
                       backgroundColor: i % 3 === 0 ? winner.color : i % 3 === 1 ? '#BC8A2C' : '#fff',
                       left: `${Math.random() * 100}%`,
                       top: `-20px`
                    }}
                  />
               ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-4xl w-full text-center relative z-10"
            >
               <div className="mb-12 flex justify-center">
                  <div className="relative">
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-80 h-80 rounded-full border-2 border-dashed border-accent/30"
                     />
                     <div
                        className="w-72 h-72 rounded-[3rem] bg-surface border border-border p-12 flex items-center justify-center shadow-[0_0_80px_rgba(188,138,44,0.3)]"
                        style={{ borderColor: winner.color }}
                     >
                        {winner.logo_url ? (
                           <img src={winner.logo_url} alt={winner.name} className="w-48 h-48 object-contain" />
                        ) : (
                           <Shield size={160} style={{ color: winner.color }} />
                        )}
                     </div>
                  </div>
               </div>

               <h2 className="text-[12px] font-bold text-accent uppercase tracking-[0.6em] mb-6">UCSF 2026 Champion</h2>
               <h1 className="text-7xl md:text-9xl font-display text-text uppercase mb-8 tracking-tight">
                  HOUSE {winner.name}
               </h1>

               <p className="font-ui text-2xl md:text-3xl text-muted uppercase tracking-[0.3em] font-semibold mb-16">
                  {winner.mascot_name || 'The Invincibles'}
               </p>

               <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="card-glass p-8">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Points</p>
                     <p className="text-4xl font-display text-accent">{winner.points}</p>
                  </div>
                  <div className="card-glass p-8">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Sports</p>
                     <p className="text-4xl font-display text-text">{winner.sports_points}</p>
                  </div>
                  <div className="card-glass p-8">
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Culture</p>
                     <p className="text-4xl font-display text-text">{winner.cultural_points}</p>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
