import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, Activity, Shield, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  subtitle: string;
}

export default function Layout({ children, activeTab, setActiveTab, title, subtitle }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Standings', icon: Trophy, href: '#scoreboard' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: 'schedule.html' },
    { id: 'matches', label: 'Matches', icon: Activity, href: '#matches' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/90 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('home')}
            className="font-display text-3xl tracking-tighter group"
          >
            UCSF <span className="text-maple group-hover:text-white transition-colors">2026</span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-sm font-bold uppercase tracking-[0.2em] transition-all hover:text-maple",
                    activeTab === item.id ? "text-maple" : "text-white/60"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-maple/10 border border-maple/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-maple rounded-full animate-pulse" />
              <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-maple">Live Updates</span>
            </div>
            
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 right-0 bg-bg-dark border-b border-white/5 p-6 flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  "font-display text-4xl text-left tracking-wider uppercase",
                  activeTab === item.id ? "text-maple" : "text-white/40"
                )}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-dark border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="font-display text-4xl mb-4">UCSF 2026</div>
          <p className="font-ui text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-8">
            {subtitle} · Shalom Hills International School
          </p>
          
          <div className="flex gap-3 mb-12">
            <div className="w-2 h-2 rounded-full bg-maple" />
            <div className="w-2 h-2 rounded-full bg-cedar" />
            <div className="w-2 h-2 rounded-full bg-ebony" />
            <div className="w-2 h-2 rounded-full bg-oak" />
          </div>

          <div className="w-full h-px bg-white/5 mb-8" />

          <div className="flex flex-col md:flex-row justify-between w-full gap-4 font-ui text-[10px] font-bold uppercase tracking-widest text-white/30">
            <span>© 2026 Shalom Hills International School. All rights reserved.</span>
            <span>Built by Ean Kotadia — Class 10E | UCSF Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
