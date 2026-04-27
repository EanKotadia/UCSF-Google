import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy, Users, Calendar, Activity,
  Layers, Camera, Bell, Info, Shield,
  ChevronRight, Heart, Star, Sparkles,
  Award, Target, Rocket, Zap, X, ArrowRight,
  Crown
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

  // Dynamic Theme Injection & House Takeover
  useEffect(() => {
    const winnerId = settings['winner_house_id'];
    const root = document.documentElement;

    if (winnerId && houses.length > 0) {
       const winningHouse = houses.find(h => h.id === winnerId);
       if (winningHouse) {
          setWinner(winningHouse);

          // FULL THEME TAKEOVER: Shift root colors to match House Identity
          root.style.setProperty('--house-bg', `${winningHouse.color}15`);
          root.style.setProperty('--house-bg2', `${winningHouse.color}25`);
          root.style.setProperty('--house-bg-dark', `${winningHouse.color}05`);
          root.style.setProperty('--house-accent', winningHouse.color);

          if (winnerId !== lastCelebratedWinnerId) {
             setShowCelebration(true);
             setLastCelebratedWinnerId(winnerId);
          }
          return;
       }
    }

    // Default UCSF Baseline (Navy/Gold)
    root.style.setProperty('--house-bg', '#003262');
    root.style.setProperty('--house-bg2', '#005C96');
    root.style.setProperty('--house-bg-dark', '#001A33');
    root.style.setProperty('--house-accent', '#BC8A2C');

    if (!winnerId) {
       setWinner(null);
       setShowCelebration(false);
       setLastCelebratedWinnerId(null);
    }
  }, [settings, houses, lastCelebratedWinnerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-16">
        <div className="relative">
          <div className="w-40 h-40 border-2 border-accent/5 border-t-accent rounded-full animate-spin duration-[2s]" />
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div
               animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 3, repeat: Infinity }}
             >
                <Shield size={64} className="text-accent/20" />
             </motion.div>
          </div>
        </div>
        <div className="text-center space-y-6">
           <h1 className="nav-logo text-6xl tracking-[0.4em] font-light">UCSF</h1>
           <p className="text-accent/40 font-bold uppercase tracking-[1em] text-[9px] animate-pulse">Initializing V3 Identity</p>
        </div>
      </div>
    );
  }

  if (activeTab === 'admin') {
     return <AdminPanel onBack={() => setActiveTab('home')} />;
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
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-32">
               <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    animate={{
                       x: [0, 60, 0],
                       y: [0, -60, 0],
                       scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[5%] left-[5%] w-[1000px] h-[1000px] bg-accent/20 rounded-full blur-[220px]"
                  />
                  <motion.div
                    animate={{
                       x: [0, -80, 0],
                       y: [0, 80, 0],
                       scale: [1, 1.25, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[0%] right-[0%] w-[1200px] h-[1200px] bg-accent/15 rounded-full blur-[250px]"
                  />
               </div>

               <motion.div
                 initial={{ opacity: 0, y: 120 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                 className="text-center z-10 max-w-[95vw] mx-auto"
               >
                  <div className="hero-eyebrow inline-flex items-center gap-6 mb-12">
                     <span className="w-2.5 h-2.5 bg-accent rounded-full animate-ping" />
                     The Continental Championship 2026
                  </div>

                  <h1 className="hero-title mb-16">
                    BEYOND ALL<br/>
                    <span className="text-accent drop-shadow-[0_0_60px_rgba(var(--house-accent-rgb),0.4)]">EXPECTATIONS</span>
                  </h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1, duration: 1.2 }}
                    className="font-ui text-2xl md:text-4xl text-text uppercase tracking-[0.9em] font-light max-w-7xl mx-auto leading-relaxed mb-28"
                  >
                     Merging athletic supremacy with soulful creation.
                  </motion.p>

                  <div className="flex flex-wrap justify-center gap-12">
                     <button
                        onClick={() => setActiveTab('events')}
                        className="btn-primary py-10 px-24 text-sm group relative overflow-hidden shadow-[0_0_50px_rgba(var(--house-accent-rgb),0.3)]"
                     >
                        <span className="relative z-10 flex items-center gap-6">
                           The Mainstage <Zap size={24} className="group-hover:rotate-12 transition-transform duration-500" />
                        </span>
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                     </button>
                     <button
                        onClick={() => setActiveTab('leaderboards')}
                        className="btn-ghost py-10 px-24 text-sm border-white/10 hover:border-accent/40 backdrop-blur-3xl"
                     >
                        The Standing
                     </button>
                  </div>
               </motion.div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mt-56 z-10 w-full max-w-7xl px-8 mx-auto">
                  {[
                     { label: 'Competitors', val: '950+', icon: Target },
                     { label: 'Soul Arts', val: '180+', icon: Heart },
                     { label: 'Coliseum', val: '52', icon: Star },
                     { label: 'Excellence', val: 'V3 ELITE', icon: Award }
                  ].map((s, i) => (
                     <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 + (i * 0.15), duration: 0.8 }}
                        key={i}
                        className="card-glass p-14 group hover:-translate-y-4 border-white/5 shadow-2xl"
                     >
                        <s.icon size={36} className="text-accent/20 group-hover:text-accent group-hover:scale-125 mb-10 transition-all duration-700" />
                        <p className="text-6xl font-display text-text mb-4 tracking-tighter tabular-nums">{s.val}</p>
                        <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.6em]">{s.label}</p>
                     </motion.div>
                  ))}
               </div>
            </section>

            {/* Premium Narrative Section */}
            <section className="py-72 px-10 border-t border-white/5 relative bg-bg-dark/60 overflow-hidden">
               <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-40 items-center">
                  <motion.div
                     initial={{ opacity: 0, x: -80 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1.2 }}
                     className="space-y-16"
                  >
                     <div className="sec-label">The Sovereign Ethos</div>
                     <h2 className="text-9xl font-display leading-[0.8] text-text tracking-tighter">Legacy<br/>In Motion</h2>
                     <p className="text-muted/70 text-3xl leading-relaxed max-w-2xl font-light">
                        UCSF 2026 defines the intersection of raw power and elegant art. We invite the bold to step into the arena and carve their names into the annals of history.
                     </p>
                     <button onClick={() => setActiveTab('about')} className="btn-ghost px-16 py-8 group border-white/10 hover:bg-accent/5">
                        Our Chronicle <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform duration-500" />
                     </button>
                  </motion.div>
                  <div className="relative">
                     <div className="absolute inset-0 bg-accent/15 rounded-[6rem] blur-[160px] animate-pulse" />
                     <div className="relative aspect-square card-glass border-white/10 flex items-center justify-center p-28 group overflow-hidden">
                        <motion.div
                           animate={{ rotate: 360 }}
                           transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 border-[20px] border-accent/5 rounded-full border-dashed"
                        />
                        <Trophy size={240} className="text-accent/5 group-hover:text-accent/10 transition-all duration-1000 scale-125" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-center space-y-4">
                              <p className="text-accent font-display text-7xl tracking-tighter">MMXXVI</p>
                              <div className="h-px w-32 bg-accent/20 mx-auto" />
                              <p className="text-[13px] text-muted font-bold uppercase tracking-[0.8em]">Supreme Edition</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
          </div>
        );

      case 'events':
        return (
          <div className="max-w-[95vw] mx-auto px-6 py-60 font-ui">
             <div className="flex flex-col items-center text-center mb-48">
                <div className="sec-label">Live Action</div>
                <h2 className="text-8xl md:text-[12rem] font-display uppercase mb-12 tracking-tighter text-text leading-none">The Arena</h2>
                <p className="text-muted/40 text-[13px] font-bold uppercase tracking-[1.2em]">Synchronized Intelligence Feed • Active Sessions</p>
             </div>

             <div className="grid grid-cols-1 gap-20">
                {matches.filter(m => m.status === 'live').map(match => (
                   <motion.div layout initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} key={match.id} className="card-glass p-20 md:p-32 border-l-[24px] border-l-danger relative group overflow-hidden border-white/5">
                      <div className="absolute top-0 right-0 p-20">
                         <div className="flex items-center gap-10 bg-danger/10 border border-danger/30 px-10 py-4 rounded-full">
                            <span className="w-4 h-4 bg-danger rounded-full animate-ping" />
                            <span className="font-ui text-danger font-bold uppercase tracking-[0.5em] text-sm">Real-time Feed</span>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                         <div className="space-y-12">
                            <p className="text-accent font-bold uppercase tracking-[0.8em] text-sm">Championship Sanctioned Event</p>
                            <h3 className="text-8xl font-display uppercase tracking-tighter text-text leading-none">{match.category_id?.replace(/-/g, ' ')}</h3>
                            <div className="flex flex-wrap items-center gap-12 text-muted/50 font-bold uppercase tracking-[0.4em] text-[14px] pt-8">
                               <span className="flex items-center gap-4"><Info size={24} className="text-accent/30" /> {match.venue}</span>
                               <span className="w-2 h-2 bg-white/10 rounded-full" />
                               <span>{match.match_time || 'Continuous Action'}</span>
                            </div>
                         </div>

                         <div className="bg-white/[0.01] border border-white/5 rounded-[6rem] p-24 flex items-center justify-around group-hover:bg-white/[0.03] transition-all duration-1000 shadow-3xl">
                            <div className="text-center space-y-8">
                               <Shield size={72} className="text-accent/10 mx-auto group-hover:scale-110 transition-transform" />
                               <span className="text-3xl font-display text-text block tracking-widest">{match.team1_id}</span>
                            </div>
                            <div className="text-9xl md:text-[12rem] font-display text-text tabular-nums tracking-tighter flex items-center gap-12">
                               {match.score1 ?? '0'}<span className="text-accent/10">:</span>{match.score2 ?? '0'}
                            </div>
                            <div className="text-center space-y-8">
                               <Shield size={72} className="text-accent/10 mx-auto group-hover:scale-110 transition-transform" />
                               <span className="text-3xl font-display text-text block tracking-widest">{match.team2_id}</span>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                ))}
                {matches.filter(m => m.status === 'live').length === 0 && (
                   <div className="col-span-full card-glass border-dashed flex flex-col items-center justify-center py-96 text-muted/20">
                      <Rocket size={160} className="mb-16 opacity-5 animate-pulse" />
                      <p className="italic uppercase text-3xl tracking-[1em] font-extralight">Standby Sequence Active. Coliseum Awaiting Signal.</p>
                   </div>
                )}
             </div>
          </div>
        );

      case 'leaderboards':
        return (
          <div className="max-w-[95vw] mx-auto px-6 py-60 font-ui">
             <div className="flex flex-col items-center text-center mb-48">
                <div className="sec-label">The Pinnacle</div>
                <h2 className="text-8xl md:text-[12rem] font-display uppercase mb-12 tracking-tighter text-text leading-none">Hierarchy</h2>
                <p className="text-muted/40 text-[13px] font-bold uppercase tracking-[1.2em]">Absolute Dominance Rankings • Cumulative Performance Index</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
                {houses.sort((a,b) => b.points - a.points).map((house, idx) => (
                   <motion.div
                     initial={{ opacity: 0, y: 80 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.25, duration: 1, ease: "easeOut" }}
                     key={house.id}
                     className="card-glass p-24 flex flex-col items-center group relative overflow-hidden border-white/5 shadow-3xl hover:bg-white/[0.04]"
                   >
                      <div className="absolute top-0 left-0 p-20">
                         <span className="text-[12rem] font-display text-white/[0.01] group-hover:text-accent/[0.03] transition-all duration-1000 leading-none tracking-tighter">0{idx + 1}</span>
                      </div>
                      <div className="w-56 h-56 rounded-[5rem] flex items-center justify-center mb-20 shadow-4xl relative z-10 transition-all duration-1000 group-hover:scale-110" style={{ backgroundColor: `${house.color}06`, border: `2px solid ${house.color}15` }}>
                         <Shield size={110} style={{ color: house.color }} className="drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]" />
                         <div className="absolute -inset-20 bg-white/5 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                      </div>
                      <h3 className="text-7xl font-display uppercase tracking-tight mb-6 text-text group-hover:text-accent transition-colors leading-none">{house.name}</h3>
                      <p className="text-muted/40 font-bold uppercase tracking-[0.8em] text-[12px] mb-24 italic text-center">"{house.motto || 'Supreme Dominion'}"</p>

                      <div className="w-full space-y-12 relative z-10">
                         <div className="flex justify-between items-end">
                            <span className="text-[14px] font-bold text-muted/30 uppercase tracking-[0.6em]">Aggregate</span>
                            <span className="text-8xl font-display text-accent leading-none tracking-tighter tabular-nums">{house.points}</span>
                         </div>
                         <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (house.points / 3000) * 100)}%` }} transition={{ duration: 3, ease: "easeOut" }} className="h-full bg-accent rounded-full shadow-[0_0_30px_rgba(var(--house-accent-rgb),0.5)]" />
                         </div>
                         <div className="grid grid-cols-2 gap-12 pt-14 border-t border-white/5">
                            <div className="text-center space-y-3">
                               <p className="text-[12px] font-bold text-subtle uppercase tracking-widest">Athletic</p>
                               <p className="text-5xl font-display text-text/90 tabular-nums leading-none">{house.sports_points || 0}</p>
                            </div>
                            <div className="text-center border-l border-white/5 space-y-3">
                               <p className="text-[12px] font-bold text-subtle uppercase tracking-widest">Creative</p>
                               <p className="text-5xl font-display text-text/90 tabular-nums leading-none">{house.cultural_points || 0}</p>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg transition-colors duration-[3s] ease-in-out">
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
           winner={winner}
         >
           <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               {renderContent()}
             </motion.div>
           </AnimatePresence>
         </Layout>
      )}

      {/* SUPREME CELEBRATION OVERLAY */}
      <AnimatePresence>
        {showCelebration && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-bg/95 backdrop-blur-[150px] overflow-hidden p-10 md:p-40"
          >
            <button
               onClick={() => setShowCelebration(false)}
               className="absolute top-24 right-24 p-10 text-muted/30 hover:text-white transition-all hover:scale-125 z-[3100] card-glass rounded-full border-white/10 hover:border-accent/40 shadow-5xl group"
            >
               <X size={80} className="group-hover:rotate-90 transition-transform duration-700" />
            </button>

            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
               {[...Array(150)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -100, opacity: 1 }}
                    animate={{ y: 2000, rotate: i % 2 === 0 ? 1440 : -1440, x: Math.random() * 600 - 300 }}
                    transition={{ duration: Math.random() * 6 + 5, repeat: Infinity, delay: Math.random() * 12 }}
                    className="absolute w-6 h-12 rounded-sm"
                    style={{ backgroundColor: i % 3 === 0 ? winner.color : i % 3 === 1 ? '#BC8A2C' : '#fff', left: `${Math.random() * 100}%`, top: `-60px` }}
                  />
               ))}
            </div>

            <motion.div
              initial={{ scale: 0.4, opacity: 0, y: 200 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 35, stiffness: 50, delay: 0.4 }}
              className="max-w-[100vw] w-full text-center relative z-10 space-y-32"
            >
               <div className="flex justify-center">
                  <div className="relative">
                     <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity } }} className="absolute -inset-40 md:-inset-80 rounded-full border border-accent/5" />
                     <motion.div animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} className="absolute -inset-20 md:-inset-40 rounded-full border-2 border-dashed border-accent/15" />
                     <div className="w-[400px] h-[400px] md:w-[850px] md:h-[850px] rounded-[10rem] md:rounded-[18rem] bg-white/[0.005] border-[16px] backdrop-blur-[80px] p-32 md:p-64 flex items-center justify-center shadow-[0_0_250px_rgba(var(--house-accent-rgb),0.3)] transition-all duration-[3s]" style={{ borderColor: winner.color }}>
                        {winner.logo_url ? (
                           <motion.img
                             initial={{ scale: 0.2, filter: 'blur(30px)' }}
                             animate={{ scale: 1, filter: 'blur(0px)' }}
                             transition={{ duration: 3, type: "spring" }}
                             src={winner.logo_url}
                             alt={winner.name}
                             className="w-full h-full object-contain filter drop-shadow-[0_0_150px_rgba(255,255,255,0.5)]"
                           />
                        ) : (
                           <Shield size={450} style={{ color: winner.color }} className="filter drop-shadow-[0_0_200px_rgba(255,255,255,0.25)]" />
                        )}
                     </div>
                     <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="absolute -top-32 left-1/2 -translate-x-1/2">
                        <Crown size={180} className="text-accent animate-bounce" />
                     </motion.div>
                  </div>
               </div>

               <div className="space-y-16">
                  <motion.h2
                    initial={{ opacity: 0, letterSpacing: '0em' }}
                    animate={{ opacity: 1, letterSpacing: '2em' }}
                    transition={{ delay: 1.5, duration: 2.5 }}
                    className="text-[24px] md:text-[32px] font-bold text-accent uppercase font-ui text-center w-full"
                  >
                     Absolute Champion Confirmed
                  </motion.h2>

                  <motion.h1
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-8xl md:text-[18rem] font-display text-text uppercase leading-[0.75] tracking-tighter"
                  >
                     CONGRATULATIONS<br/>
                     <span style={{ color: winner.color }} className="drop-shadow-[0_0_80px_rgba(0,0,0,0.7)]">HOUSE {winner.name}</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3, duration: 1.5 }}
                    className="font-ui text-6xl md:text-[10rem] text-muted/20 uppercase tracking-[0.4em] font-thin italic"
                  >
                     Congratulations {winner.name} House Won!
                  </motion.p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-20 max-w-[90vw] mx-auto pt-32 px-10">
                  {[
                     { l: 'Total Dominance', v: winner.points, c: 'text-accent' },
                     { l: 'Athletic Index', v: winner.sports_points, c: 'text-text' },
                     { l: 'Cultural Index', v: winner.cultural_points, c: 'text-text' }
                  ].map((st, i) => (
                     <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4 + (i*0.4) }} key={i} className="card-glass p-24 border-white/5 shadow-5xl">
                        <p className="text-[16px] font-bold text-muted/50 uppercase tracking-[0.8em] mb-12">{st.l}</p>
                        <p className={cn("text-[10rem] font-display tabular-nums leading-none tracking-tighter", st.c)}>{st.v}</p>
                     </motion.div>
                  ))}
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
