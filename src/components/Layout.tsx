import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  subtitle: string;
  announcement?: string;
  footerText?: string;
  schoolLogoUrl?: string;
  profile?: any;
  winner?: any;
}

export default function Layout({ children, activeTab, setActiveTab, title, subtitle, announcement, footerText, schoolLogoUrl, profile, winner }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'events', label: 'Mainstage' },
    { id: 'schedule', label: 'Agenda' },
    { id: 'leaderboards', label: 'Standings' },
    { id: 'notices', label: 'Bulletin' },
    { id: 'gallery', label: 'Chronicle' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent/30 font-sans relative">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[110] transition-all duration-500",
          scrolled ? "pt-0" : "pt-4"
        )}
      >
        {announcement && (
          <div className="bg-accent text-bg py-2 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-[0.4em] relative overflow-hidden">
            <div className="relative z-10">{announcement}</div>
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          </div>
        )}

        <nav
          className={cn(
            "mx-auto transition-all duration-500 flex items-center justify-between px-10 md:px-20 h-[90px]",
            scrolled
              ? "max-w-full bg-bg-dark/80 backdrop-blur-2xl border-b border-white/5"
              : "max-w-[95%] bg-white/[0.02] backdrop-blur-lg border border-white/5 rounded-2xl mt-4"
          )}
        >
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-5 group"
          >
            <div className="relative">
               {winner ? (
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative">
                     <Shield size={32} style={{ color: winner.color }} className="group-hover:scale-110 transition-transform" />
                     <div className="absolute inset-0 blur-xl opacity-40 animate-pulse" style={{ backgroundColor: winner.color }} />
                  </motion.div>
               ) : (
                  <div className="relative">
                     <Shield size={28} className="text-accent group-hover:scale-110 transition-transform" />
                     <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
               )}
            </div>
            <div className="text-left">
               <p className="nav-logo leading-none">UCSF</p>
               <p className="text-[9px] text-muted/60 font-bold uppercase tracking-[0.3em] mt-1.5">
                  {winner ? `Champion: ${winner.name}` : 'Fest 2026'}
               </p>
            </div>
          </button>

          {/* Minimal Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-14 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[12px] font-bold uppercase tracking-[3px] transition-all relative py-3 group",
                    activeTab === item.id ? "text-accent" : "text-muted hover:text-text"
                  )}
                >
                  {item.label}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-[1px] bg-accent transition-all duration-500 transform origin-left",
                    activeTab === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            <button
               onClick={() => setActiveTab('admin')}
               className={cn(
                 "hidden md:inline-flex items-center gap-3 font-ui text-[11px] font-bold uppercase tracking-[2px] transition-all hover:text-accent",
                 activeTab === 'admin' ? "text-accent" : "text-muted"
               )}
            >
               <Shield size={14} /> Admin
            </button>
            <button 
              className="xl:hidden p-3 bg-white/5 rounded-xl text-muted hover:text-text border border-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Overlay Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="xl:hidden fixed inset-0 bg-bg-dark/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-12 z-[120] p-10"
              >
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="absolute top-10 right-10 p-4 bg-white/5 rounded-full text-muted border border-white/5"
                >
                  <X size={32} />
                </button>

                <div className="flex flex-col items-center gap-4 mb-8">
                   <Shield size={60} className="text-accent" />
                   <h2 className="nav-logo text-6xl">UCSF</h2>
                </div>

                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "font-display text-5xl tracking-widest uppercase transition-all",
                      activeTab === item.id ? "text-accent scale-110" : "text-muted hover:text-text"
                    )}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMenuOpen(false);
                  }}
                  className="mt-12 font-ui text-sm font-bold uppercase tracking-[4px] text-accent border border-accent/20 px-10 py-4 rounded-2xl bg-accent/5"
                >
                  Administrative Portal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <main className="flex-grow z-10">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="bg-bg-dark border-t border-white/5 py-32 px-10 md:px-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="flex flex-col items-center text-center gap-8">
             <div className="relative group">
                <img
                  src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                  alt="School Logo"
                  className="h-20 object-contain grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="space-y-4">
                <div className="nav-logo text-5xl tracking-[8px]">UCSF <span className="text-accent">2026</span></div>
                <p className="font-ui text-[11px] font-bold uppercase tracking-[6px] text-muted/40 max-w-lg leading-relaxed mx-auto">
                  Union of Culture & Sports Festival
                </p>
             </div>
          </div>

          <div className="w-24 h-px bg-white/5" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full text-center">
             <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[4px] text-accent">Venue</p>
                <p className="text-muted text-sm uppercase tracking-widest font-medium">Grand Arena, SHIS Campus</p>
             </div>
             <div className="space-y-4 border-y md:border-y-0 md:border-x border-white/5 py-8 md:py-0">
                <p className="text-[10px] font-bold uppercase tracking-[4px] text-accent">Contact</p>
                <p className="text-muted text-sm uppercase tracking-widest font-medium">info@shalomhills.com</p>
             </div>
             <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[4px] text-accent">Dates</p>
                <p className="text-muted text-sm uppercase tracking-widest font-medium">November 12-15, 2026</p>
             </div>
          </div>

          <div className="pt-20 text-[10px] font-bold uppercase tracking-[3px] text-subtle/30">
            © 2026 Shalom Hills International School • All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
