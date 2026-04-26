import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
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
}

export default function Layout({ children, activeTab, setActiveTab, title, subtitle, announcement, footerText, schoolLogoUrl, profile }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'committees', label: 'Committees' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'leaderboards', label: 'Rankings' },
    { id: 'notices', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'sponsors', label: 'Sponsors' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-gold selection:text-bg font-ui">
      <header className="fixed top-0 left-0 right-0 z-[110]">
        {announcement && (
          <div className="bg-gold text-bg py-2 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-widest relative">
            {announcement}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-10 h-[72px] bg-bg/90 backdrop-blur-xl border-b border-white/5">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-4 group"
          >
            <div className="flex flex-col items-start">
               <div className="flex items-center gap-2">
                  <img
                    src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                    alt="School Logo"
                    className="h-8 object-contain group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="h-6 w-px bg-white/20" />
                  <div className="text-left">
                     <p className="text-[12px] font-bold uppercase tracking-[0.1em] leading-none mb-0.5">Harmonia</p>
                     <p className="text-[8px] text-gold font-bold uppercase tracking-widest">MUN 2026</p>
                  </div>
               </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-8 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[11px] font-bold uppercase tracking-[2px] transition-colors",
                    activeTab === item.id ? "text-gold" : "text-white/40 hover:text-white"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
               onClick={() => setActiveTab('admin')}
               className={cn(
                 "hidden md:block px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all",
                 activeTab === 'admin' ? "bg-gold text-bg border-gold" : "border-white/10 text-white/60 hover:border-gold hover:text-gold"
               )}
            >
               Admin
            </button>
            <button 
              className="xl:hidden p-2 text-white/40 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="xl:hidden absolute top-full left-0 right-0 bg-bg border-b border-white/10 p-8 flex flex-col gap-6 z-[101] shadow-2xl"
              >
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "font-display text-3xl text-left tracking-wider uppercase",
                      activeTab === item.id ? "text-gold" : "text-white/40"
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
                  className={cn(
                    "font-display text-3xl text-left tracking-wider uppercase",
                    activeTab === 'admin' ? "text-gold" : "text-white/40"
                  )}
                >
                  Admin
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Spacer for fixed header */}
        <div className={cn(
          announcement ? "h-[102px]" : "h-[72px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg border-t border-white/5 py-24 px-6 md:px-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="flex flex-col items-center gap-6">
             <img
               src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
               alt="School Logo"
               className="h-16 md:h-20 object-contain mb-4 opacity-40 hover:opacity-100 transition-opacity"
               referrerPolicy="no-referrer"
             />
             <div className="font-display text-4xl tracking-[4px] uppercase">
               Harmonia <span className="text-gold">MUN</span>
             </div>
             <p className="font-ui text-[10px] font-bold uppercase tracking-[4px] text-white/40 max-w-md leading-relaxed">
               Union of Culture & Sports Fest 2026
             </p>
          </div>

          <div className="w-24 h-px bg-white/10" />

          <div className="flex flex-col gap-4 font-ui text-[9px] font-bold uppercase tracking-widest text-white/20">
            <span>© 2026 Shalom Hills International School</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
