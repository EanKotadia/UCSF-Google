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
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent/30 font-sans relative">
      <header className="fixed top-0 left-0 right-0 z-[110]">
        {announcement && (
          <div className="bg-accent text-bg py-2 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-widest relative">
            {announcement}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 h-[80px] bg-bg/80 backdrop-blur-xl border-b border-border">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group"
          >
            <img
              src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
              alt="School Logo"
              className="h-10 object-contain group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="h-6 w-px bg-border mx-2" />
            <div className="text-left">
               <p className="nav-logo leading-none">UCSF</p>
               <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1">Fest 2026</p>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-10 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[12px] font-bold uppercase tracking-[2px] transition-all relative py-2",
                    activeTab === item.id ? "text-accent" : "text-muted hover:text-text"
                  )}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
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
                 "hidden md:block btn-primary px-5 py-2.5 rounded-lg",
                 activeTab === 'admin' ? "bg-accent text-bg" : "bg-transparent border border-accent/30 text-accent hover:bg-accent/10"
               )}
            >
               Admin
            </button>
            <button 
              className="xl:hidden p-2 text-muted hover:text-text"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="xl:hidden fixed inset-y-0 right-0 w-[300px] bg-dark border-l border-border p-12 flex flex-col gap-8 z-[120] shadow-2xl"
              >
                <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 text-muted hover:text-text">
                  <X size={24} />
                </button>
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      "font-display text-3xl text-left tracking-wider uppercase",
                      activeTab === item.id ? "text-accent" : "text-muted"
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
                    activeTab === 'admin' ? "text-accent" : "text-muted"
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
      <main className="flex-grow z-10">
        {/* Spacer for fixed header */}
        <div className={cn(
          announcement ? "h-[104px]" : "h-[80px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-dark border-t border-border py-20 px-6 md:px-12 text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
             <img
               src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
               alt="School Logo"
               className="h-16 object-contain mb-2 opacity-50 hover:opacity-100 transition-opacity"
               referrerPolicy="no-referrer"
             />
             <div className="nav-logo text-4xl">
               UCSF <span className="text-accent">2026</span>
             </div>
             <p className="font-ui text-[10px] font-bold uppercase tracking-[4px] text-muted max-w-md leading-relaxed">
               Union of Culture & Sports Fest
             </p>
          </div>

          <div className="w-20 h-px bg-border" />

          <div className="flex flex-col gap-3 font-ui text-[10px] font-bold uppercase tracking-widest text-subtle">
            <span>© 2026 Shalom Hills International School</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
