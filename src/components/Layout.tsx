import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Committee } from '../types';

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
  committees?: Committee[];
  onCommitteeClick?: (slug: string) => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  title,
  subtitle,
  announcement,
  footerText,
  schoolLogoUrl,
  profile,
  committees = [],
  onCommitteeClick
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommitteesDropdownOpen, setIsCommitteesDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'committees', label: 'Committees', isDropdown: true },
    { id: 'schedule', label: 'Schedule', href: '#schedule' },
    { id: 'rankings', label: 'Rankings', href: '#rankings' },
    { id: 'notices', label: 'Notices', href: '#notices' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'sponsors', label: 'Sponsors', href: '#sponsors' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-maple selection:text-bg">
      <header className="fixed top-0 left-0 right-0 z-[110]">
        {announcement && (
          <div className="bg-maple text-bg py-2 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-widest relative">
            {announcement}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-10 h-[62px] bg-bg/90 backdrop-blur-xl border-b border-border">
          <button 
            onClick={() => setActiveTab('home')}
            className="nav-logo flex items-center"
          >
            <img 
              src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"} 
              alt="School Logo" 
              className="h-10 md:h-12 object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="ml-3 flex flex-col items-start leading-none">
              <span className="font-display text-lg tracking-wider text-white">HARMONIA</span>
              <span className="font-ui text-[8px] font-bold text-maple tracking-[2px]">MUN 2026</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {navItems.map((item, idx) => (
              <li key={idx} className="relative">
                {item.isDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsCommitteesDropdownOpen(true)}
                    onMouseLeave={() => setIsCommitteesDropdownOpen(false)}
                  >
                    <button
                      className={cn(
                        "font-ui text-[13px] font-bold uppercase tracking-[1.5px] transition-colors flex items-center gap-1",
                        activeTab.startsWith('committee-') ? "text-maple" : "text-muted hover:text-text"
                      )}
                    >
                      {item.label}
                      <ChevronDown size={14} className={cn("transition-transform", isCommitteesDropdownOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isCommitteesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-bg border border-border rounded-xl shadow-2xl p-2 z-[120] backdrop-blur-xl"
                        >
                          {committees.length > 0 ? (
                            committees.map((committee) => (
                              <button
                                key={committee.id}
                                onClick={() => {
                                  onCommitteeClick?.(committee.slug);
                                  setIsCommitteesDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors font-ui text-[11px] font-bold uppercase tracking-widest text-muted hover:text-maple"
                              >
                                {committee.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-[10px] font-bold text-muted/50 uppercase tracking-widest">No Committees</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.href?.startsWith('#') && item.id === activeTab) {
                        const el = document.getElementById(item.href.substring(1));
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "font-ui text-[13px] font-bold uppercase tracking-[1.5px] transition-colors",
                      activeTab === item.id ? "text-maple" : "text-muted hover:text-text"
                    )}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
             {profile?.is_super_admin && (
                <button
                  onClick={() => window.open('/admin', '_blank')}
                  className="hidden md:flex font-ui text-[10px] font-bold uppercase tracking-widest text-maple border border-maple/30 px-4 py-2 rounded-lg hover:bg-maple/10 transition-all"
                >
                  Admin
                </button>
             )}
            <button 
              className="md:hidden p-2 text-text"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute top-full left-0 right-0 bg-bg border-b border-border p-6 flex flex-col gap-4 z-[101] shadow-2xl max-h-[80vh] overflow-y-auto"
              >
                {navItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (item.isDropdown) {
                          setIsCommitteesDropdownOpen(!isCommitteesDropdownOpen);
                        } else {
                          setActiveTab(item.id);
                          setIsMenuOpen(false);
                          if (item.href?.startsWith('#')) {
                            setTimeout(() => {
                              const el = document.getElementById(item.href.substring(1));
                              el?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }
                        }
                      }}
                      className={cn(
                        "font-display text-3xl text-left tracking-wider uppercase flex items-center justify-between",
                        activeTab === item.id || (item.isDropdown && activeTab.startsWith('committee-')) ? "text-maple" : "text-muted"
                      )}
                    >
                      {item.label}
                      {item.isDropdown && <ChevronDown size={24} className={cn("transition-transform", isCommitteesDropdownOpen && "rotate-180")} />}
                    </button>
                    {item.isDropdown && isCommitteesDropdownOpen && (
                      <div className="flex flex-col gap-3 pl-4 border-l border-white/10 mt-2">
                        {committees.map((committee) => (
                          <button
                            key={committee.id}
                            onClick={() => {
                              onCommitteeClick?.(committee.slug);
                              setIsMenuOpen(false);
                              setIsCommitteesDropdownOpen(false);
                            }}
                            className="text-left font-ui text-[14px] font-bold uppercase tracking-widest text-muted hover:text-maple py-1"
                          >
                            {committee.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Spacer for fixed header */}
        <div className={cn(
          announcement ? "h-[92px]" : "h-[62px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg border-t border-border py-16 px-6 md:px-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
              alt="School Logo"
              className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="h-12 w-px bg-border hidden sm:block" />
             <div className="text-left hidden sm:flex flex-col leading-none">
              <span className="font-display text-2xl tracking-widest text-white">HARMONIA</span>
              <span className="font-ui text-[10px] font-bold text-maple tracking-[4px]">MUN 2026</span>
            </div>
          </div>
          <div className="font-display text-4xl tracking-[6px] uppercase">
            {title.split(' ')[0]} <span>{title.split(' ')[1] || ''}</span>
          </div>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[4px] text-muted max-w-2xl">
            {subtitle}
          </p>
          <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted/50 mt-4 leading-relaxed">
            {footerText || `© 2026 ${title}. All rights reserved.`}
          </p>
          
          <div className="w-full h-px bg-border my-8" />

          <div className="flex flex-col md:flex-row justify-between w-full gap-6 font-sans text-[12px] text-subtle/60">
            <span>© 2026 Shalom Hills International School | HARMONIA MUN Chapter 2</span>
            <div className="flex gap-8 justify-center">
              <a href="#" className="hover:text-maple transition-colors">Instagram</a>
              <a href="#" className="hover:text-maple transition-colors">Facebook</a>
              <a href="#" className="hover:text-maple transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
