import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Users, Calendar, Activity,
  Layers, Camera, Bell, Info, Shield,
  ChevronRight, Heart, Star, Sparkles,
  Award, Target, Rocket, Zap, X, ArrowRight,
  MapPin, Clock
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
            {/* Hero Section */}
            <div className="relative h-[85vh] flex flex-col items-center justify-center text-center overflow-hidden">
               {/* Premium Background Orbs */}
               <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-accent/15 blur-[140px] rounded-full animate-pulse pointer-events-none" />
               <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-bg2/30 blur-[120px] rounded-full animate-pulse delay-700 pointer-events-none" />

               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative z-10 px-6"
               >
                 <div className="hero-eyebrow">The Ultimate Showdown</div>
                 <h1 className="hero-title leading-[0.85] flex flex-col items-center">
                    <span>UCSF</span>
                    <span className="text-accent">2026</span>
                 </h1>
                 <p className="hero-sub">Union of Culture & Sports Fest 2026</p>

                 <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
                    <button onClick={() => setActiveTab('leaderboards')} className="btn-primary px-12 py-5 text-[14px]">
                       View Leaderboard <ArrowRight size={20} />
                    </button>
                    <button onClick={() => setActiveTab('schedule')} className="btn-ghost px-12 py-5 text-[14px]">
                       Event Schedule
                    </button>
                 </div>
               </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-6xl mx-auto w-full -mt-20 relative z-20 mb-32">
               {[
                  { label: 'Houses', val: '4', icon: Shield },
                  { label: 'Sporting Events', val: '8', icon: Activity },
                  { label: 'Cultural Events', val: '4', icon: Sparkles },
                  { label: 'Champion', val: '1', icon: Trophy }
               ].map((s, i) => (
                  <div key={i} className="card-glass p-8 text-center group hover:border-accent/30 transition-all">
                     <s.icon size={24} className="text-accent/50 group-hover:text-accent mx-auto mb-4 transition-colors" />
                     <p className="text-3xl font-display text-text mb-1">{s.val}</p>
                     <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{s.label}</p>
                  </div>
               ))}
            {/* Rankings + Scores Section */}
            <div className="max-w-6xl mx-auto px-6 w-full mb-32">
               <div className="flex flex-col items-center text-center mb-12">
                  <div className="sec-label">Rankings & Standing</div>
                  <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight text-text">House Standings</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {houses.sort((a, b) => b.points - a.points).slice(0, 4).map((house, i) => (
                     <div key={house.id} className={cn(
                        "card-glass p-8 flex items-center justify-between group hover:border-accent/30 transition-all",
                        i === 0 ? "border-accent/40 bg-accent/5" : ""
                     )}>
                        <div className="flex items-center gap-6">
                           <div className="text-3xl font-display text-accent/30 w-8">{(i + 1).toString().padStart(2, '0')}</div>
                           <div className="w-12 h-12 rounded-xl bg-bg2 flex items-center justify-center p-2 border border-border group-hover:border-accent/30 transition-all">
                              {house.logo_url ? (
                                 <img src={house.logo_url} alt={house.name} className="w-full h-full object-contain" />
                              ) : (
                                 <Shield className="text-accent/50" size={24} />
                              )}
                           </div>
                           <div>
                              <h3 className="text-xl font-display uppercase tracking-tight text-text">House {house.name}</h3>
                              <p className="text-muted text-[9px] font-bold uppercase tracking-widest">{house.mascot_name || 'Titans'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-3xl font-display text-accent">{house.points}</div>
                           <div className="text-muted text-[8px] font-bold uppercase tracking-widest">Points</div>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-12 text-center">
                  <button onClick={() => setActiveTab('leaderboards')} className="btn-ghost px-10 py-4">
                     Detailed Rankings <ChevronRight size={18} />
                  </button>
               </div>
            </div>

            {/* Notices + Schedule Snippet Section */}
            <div className="max-w-6xl mx-auto px-6 w-full mb-32 grid lg:grid-cols-2 gap-16">
               {/* Left: Recent Notices */}
               <div>
                  <div className="flex items-center gap-4 mb-8">
                     <Bell className="text-accent" size={24} />
                     <h2 className="text-4xl font-display uppercase tracking-tight text-text">Latest Notices</h2>
                  </div>
                  <div className="space-y-4">
                     {notices.slice(0, 3).map(notice => (
                        <div key={notice.id} className={cn(
                           "card-glass p-6",
                           notice.priority === 'high' ? "border-danger/30 bg-danger/5" : ""
                        )}>
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-display text-text uppercase">{notice.title}</h3>
                              <span className="text-[9px] text-muted font-bold uppercase tracking-widest">{new Date(notice.created_at).toLocaleDateString()}</span>
                           </div>
                           <p className="text-muted text-sm line-clamp-2">{notice.content}</p>
                        </div>
                     ))}
                     <button onClick={() => setActiveTab('notices')} className="w-full btn-ghost justify-center py-4 mt-4">
                        All Notices
                     </button>
                  </div>
               </div>

               {/* Right: Schedule Snippet */}
               <div>
                  <div className="flex items-center gap-4 mb-8">
                     <Calendar className="text-accent" size={24} />
                     <h2 className="text-4xl font-display uppercase tracking-tight text-text">Upcoming Events</h2>
                  </div>
                  <div className="space-y-4">
                     {schedule.filter(s => s.status !== 'completed').slice(0, 3).map(item => (
                        <div key={item.id} className="card-glass p-6 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="text-center">
                                 <p className="text-accent font-display text-xl leading-none">{item.time_start?.slice(0, 5)}</p>
                                 <p className="text-muted text-[8px] font-bold uppercase tracking-widest mt-1">{item.day_label}</p>
                              </div>
                              <div>
                                 <h3 className="text-lg font-display text-text uppercase leading-none mb-1">{item.title}</h3>
                                 <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{item.venue}</p>
                              </div>
                           </div>
                           <span className={cn(
                              "badge",
                              item.status === 'live' ? "badge-live" : "badge-upcoming"
                           )}>{item.status === 'live' ? 'Live' : 'Next'}</span>
                        </div>
                     ))}
                     <button onClick={() => setActiveTab('schedule')} className="w-full btn-ghost justify-center py-4 mt-4">
                        Full Schedule
                     </button>
                  </div>
               </div>
            </div>
          </div>
        );

      case 'leaderboards':
        return (
          <div className="max-w-6xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="sec-label">Rankings</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight text-text">Leaderboard</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>

             <div className="grid gap-6">
                {houses.sort((a, b) => b.points - a.points).map((house, i) => (
                   <div key={house.id} className={cn(
                      "card-glass overflow-hidden flex items-center p-6 md:p-8 transition-all hover:translate-x-2 group",
                      i === 0 ? "border-accent/40 bg-accent/5" : ""
                   )}>
                      <div className="w-16 md:w-24 text-4xl md:text-6xl font-display text-accent/20 group-hover:text-accent/40 transition-colors">
                         {(i + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="flex-grow flex items-center gap-6">
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-bg2 flex items-center justify-center p-3 border border-border group-hover:border-accent/30 transition-all">
                            {house.logo_url ? (
                               <img src={house.logo_url} alt={house.name} className="w-full h-full object-contain" />
                            ) : (
                               <Shield className="text-accent/50" size={32} />
                            )}
                         </div>
                         <div>
                            <h3 className="text-2xl md:text-4xl font-display uppercase tracking-tight text-text">House {house.name}</h3>
                            <p className="text-muted text-[11px] font-bold uppercase tracking-[0.3em]">{house.mascot_name || 'Titans'}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-4xl md:text-6xl font-display text-text">{house.points}</div>
                         <div className="text-muted text-[10px] font-bold uppercase tracking-widest">Points</div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'events':
        return (
          <div className="max-w-6xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="sec-label">Sports</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight text-text">Fixtures</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="grid md:grid-cols-2 gap-8">
                {matches.map(match => {
                   const h1 = houses.find(h => h.id === match.team1_id);
                   const h2 = houses.find(h => h.id === match.team2_id);
                   return (
                      <div key={match.id} className="card-glass p-8 hover:border-accent/30 transition-all group">
                         <div className="flex justify-between items-center mb-8">
                            <span className="badge badge-upcoming">Match #{match.match_no}</span>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{match.match_time}</span>
                         </div>
                         <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 text-center">
                               <div className="w-16 h-16 bg-bg2 rounded-2xl mx-auto mb-4 border border-border flex items-center justify-center group-hover:border-accent/20 transition-all">
                                  {h1?.logo_url ? (
                                     <img src={h1.logo_url} className="w-full h-full object-contain" alt="" />
                                  ) : (
                                     <Shield size={24} className="text-accent/40" />
                                  )}
                               </div>
                               <p className="font-display text-xl text-text uppercase">{h1?.name || 'TBD'}</p>
                            </div>
                            <div className="px-6 py-2 bg-white/5 rounded-full font-display text-accent text-lg">VS</div>
                            <div className="flex-1 text-center">
                               <div className="w-16 h-16 bg-bg2 rounded-2xl mx-auto mb-4 border border-border flex items-center justify-center group-hover:border-accent/20 transition-all">
                                  {h2?.logo_url ? (
                                     <img src={h2.logo_url} className="w-full h-full object-contain" alt="" />
                                  ) : (
                                     <Shield size={24} className="text-accent/40" />
                                  )}
                               </div>
                               <p className="font-display text-xl text-text uppercase">{h2?.name || 'TBD'}</p>
                            </div>
                         </div>
                         <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted">
                               <Info size={14} />
                               <span className="text-[11px] font-bold uppercase tracking-widest">{match.venue}</span>
                            </div>
                            <div className="text-accent font-display text-xl uppercase">{match.status}</div>
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="max-w-4xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="sec-label">Timeline</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight text-text">Schedule</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="timeline">
                {schedule.map((item, i) => (
                   <div key={item.id} className="relative flex gap-8 pb-16 last:pb-0 group">
                      <div className="w-[80px] md:w-[120px] flex flex-col items-end pt-2">
                         <span className="text-accent font-display text-3xl md:text-4xl">{item.time_start?.slice(0, 5)}</span>
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
                         )}>{item.status === 'live' ? 'Live & Ongoing' : item.status}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'gallery':
        const galleryUrl = settings['gallery_drive_url'] || 'https://drive.google.com/drive/folders/1placeholder-link';
        return (
          <div className="max-w-7xl mx-auto px-6 py-24 font-ui min-h-[60vh] flex flex-col">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="sec-label">Moments</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight text-text">Gallery</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>

             <div className="flex-grow flex flex-col items-center justify-center">
                <div className="card-glass p-16 text-center max-w-2xl w-full border-dashed border-accent/30 bg-accent/5">
                   <Camera size={80} className="text-accent mb-8 mx-auto" />
                   <h3 className="text-4xl font-display text-text uppercase mb-6">Official Event Gallery</h3>
                   <p className="text-muted mb-12 text-sm md:text-base uppercase tracking-widest font-bold leading-relaxed">
                      All memories, high-resolution photos, and videos from UCSF 2026 are captured and shared in our official Google Drive repository.
                   </p>
                   <a
                      href={galleryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-16 py-6 text-lg inline-flex items-center gap-4 group"
                   >
                      View on Google Drive <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                   </a>
                </div>
             </div>
          </div>
        );

      case 'notices':
        return (
          <div className="max-w-4xl mx-auto px-6 py-24 font-ui">
             <div className="flex flex-col items-center text-center mb-20">
                <div className="sec-label">Bulletin</div>
                <h2 className="text-6xl md:text-8xl font-display uppercase mb-4 tracking-tight text-text">Notices</h2>
                <div className="h-[2px] w-24 bg-accent/30 rounded-full" />
             </div>
             <div className="space-y-6">
                {notices.length > 0 ? notices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((notice) => (
                   <div key={notice.id} className={cn(
                      "card-glass p-8 relative overflow-hidden",
                      notice.priority === 'high' ? "border-danger/30 bg-danger/5" : ""
                   )}>
                      {notice.priority === 'high' && (
                         <div className="absolute top-0 right-0 px-4 py-1 bg-danger text-bg text-[9px] font-bold uppercase tracking-widest rounded-bl-xl">
                            Urgent
                         </div>
                      )}
                      <div className="flex items-start gap-6">
                         <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                            notice.priority === 'high' ? "bg-danger/20 text-danger" : "bg-accent/10 text-accent"
                         )}>
                            <Bell size={20} />
                         </div>
                         <div>
                            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">
                               {new Date(notice.created_at).toLocaleDateString()}
                            </div>
                            <h3 className="text-2xl font-display text-text uppercase mb-4">{notice.title}</h3>
                            <p className="text-muted leading-relaxed">{notice.content}</p>
                         </div>
                      </div>
                   </div>
                )) : (
                  <div className="py-32 text-center card-glass">
                    <Bell size={48} className="text-muted mx-auto mb-6 opacity-20" />
                    <p className="text-muted uppercase tracking-[0.3em] font-bold">All clear for now.</p>
                  </div>
                )}
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
                        {houseMascotLogos[winner.name] ? (
                           <img src={houseMascotLogos[winner.name]} alt={winner.name} className="w-48 h-48 object-contain" />
                        ) : winner.logo_url ? (
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

const houseMascotLogos: Record<string, string> = {
  'TITANS': 'https://v3.v0.app/api/assets?id=titans-logo',
  'PHOENIX': 'https://v3.v0.app/api/assets?id=phoenix-logo',
  'WARRIORS': 'https://v3.v0.app/api/assets?id=warriors-logo',
  'DRAGONS': 'https://v3.v0.app/api/assets?id=dragons-logo'
};

export default App;
