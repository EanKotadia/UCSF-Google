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
    { id: 'events', label: 'Events' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'leaderboards', label: 'Rankings' },
    { id: 'notices', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'sponsors', label: 'Sponsors' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent/30 font-ui">
      <header className="fixed top-0 left-0 right-0 z-[110]">
        {announcement && (
          <div className="bg-accent text-text py-1.5 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-widest relative">
            {announcement}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 h-[72px] bg-white/80 backdrop-blur-xl border-b border-border">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group"
          >
            <img
              src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
              alt="School Logo"
              className="h-9 object-contain group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-px bg-border mx-1" />
            <div className="text-left">
               <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-primary leading-none mb-0.5">UCSF</p>
               <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest">2026</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-10 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[11px] font-bold uppercase tracking-[1.5px] transition-all relative py-2",
                    activeTab === item.id ? "text-primary" : "text-text-muted hover:text-text"
                  )}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
               onClick={() => setActiveTab('admin')}
               className={cn(
                 "hidden md:block px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                 activeTab === 'admin' ? "bg-primary text-white" : "bg-primary-muted text-primary hover:bg-primary hover:text-white"
               )}
            >
               Admin
            </button>
            <button 
              className="xl:hidden p-2 text-text-muted hover:text-text"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-border p-8 flex flex-col gap-6 z-[101] shadow-xl"
              >
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "font-display text-2xl text-left tracking-wider uppercase",
                      activeTab === item.id ? "text-primary" : "text-text-muted"
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
                    "font-display text-2xl text-left tracking-wider uppercase",
                    activeTab === 'admin' ? "text-primary" : "text-text-muted"
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
          announcement ? "h-[104px]" : "h-[72px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-alt border-t border-border py-20 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
             <img
               src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
               alt="School Logo"
               className="h-14 object-contain mb-2 opacity-60 hover:opacity-100 transition-opacity"
               referrerPolicy="no-referrer"
             />
             <div className="font-display text-3xl tracking-[2px] uppercase">
               UCSF <span className="text-primary">2026</span>
             </div>
             <p className="font-ui text-[9px] font-bold uppercase tracking-[3px] text-text-muted max-w-md leading-relaxed">
               Union of Culture & Sports Fest
             </p>
          </div>

          <div className="w-16 h-px bg-border" />

          <div className="flex flex-col gap-3 font-ui text-[9px] font-bold uppercase tracking-widest text-text-muted/60">
            <span>© 2026 Shalom Hills International School</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
