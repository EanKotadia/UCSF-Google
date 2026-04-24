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
    { id: 'oc', label: 'OC' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'rankings', label: 'Rankings' },
  ];

  return (
    <div className='min-h-screen flex flex-col bg-[#050b1a] text-white selection:bg-maple selection:text-bg'>
      <header className='fixed top-0 left-0 right-0 z-[110]'>
        {announcement && (
          <div className='bg-maple text-bg py-2 px-6 text-center font-ui text-[9px] font-bold uppercase tracking-[0.3em] relative'>
            {announcement}
          </div>
        )}
        <nav className='flex items-center justify-between px-6 md:px-12 h-[72px] bg-[#050b1a]/90 backdrop-blur-xl border-b border-white/5'>
          <button 
            onClick={() => setActiveTab('home')}
            className='flex items-center gap-4'
          >
            <img 
              src={schoolLogoUrl || 'https://www.shalomhills.com/images/logo.png'}
              alt='School Logo'
              className='h-10 md:h-12 object-contain'
              referrerPolicy='no-referrer'
            />
            <div className='hidden sm:block text-left'>
               <div className='font-display text-xl tracking-wider leading-none'>{title}</div>
               <div className='text-[8px] font-bold text-maple uppercase tracking-widest mt-1'>2026 Conference</div>
            </div>
          </button>

          <ul className='hidden lg:flex items-center gap-10 list-none'>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'font-ui text-[11px] font-bold uppercase tracking-[2px] transition-all relative py-2',
                    activeTab === item.id ? 'text-maple' : 'text-white/40 hover:text-white'
                  )}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div
                      layoutId='nav-underline'
                      className='absolute bottom-0 left-0 right-0 h-px bg-maple'
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className='flex items-center gap-6'>
            {profile?.is_super_admin && (
               <a
                href={import.meta.env.VITE_ADMIN_URL || '/admin'}
                className='hidden md:block px-6 py-2 border border-maple/30 rounded-full font-ui text-[10px] font-bold uppercase tracking-widest text-maple hover:bg-maple hover:text-bg transition-all'
               >
                 Admin Portal
               </a>
            )}
            <button 
              className='lg:hidden p-2 text-white/60 hover:text-white'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className='lg:hidden absolute top-full left-0 right-0 bg-[#050b1a] border-b border-white/5 p-8 flex flex-col gap-8 z-[101] shadow-2xl'
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={cn(
                      'font-display text-4xl text-left tracking-tight uppercase',
                      activeTab === item.id ? 'text-maple' : 'text-white/20'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <main className='flex-grow'>
        {children}
      </main>

      <footer className='bg-[#050b1a] border-t border-white/5 py-24 px-6 md:px-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24'>
            <div className='col-span-1 md:col-span-2'>
              <img
                src={schoolLogoUrl || 'https://www.shalomhills.com/images/logo.png'}
                className='h-16 mb-8 opacity-80'
              />
              <h3 className='text-4xl font-display uppercase tracking-tight mb-4'>{title}</h3>
              <p className='text-white/40 max-w-sm leading-relaxed'>
                Shalom Hills International School premier Model United Nations conference.
                Shaping the diplomats of tomorrow.
              </p>
            </div>

            <div>
              <h4 className='font-ui text-xs font-bold uppercase tracking-[0.3em] text-maple mb-8'>Navigation</h4>
              <ul className='space-y-4'>
                {navItems.map(item => (
                  <li key={item.id}>
                    <button onClick={() => setActiveTab(item.id)} className='text-white/40 hover:text-maple transition-colors uppercase font-ui text-[10px] font-bold tracking-widest'>{item.label}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className='font-ui text-xs font-bold uppercase tracking-[0.3em] text-maple mb-8'>Venue</h4>
              <p className='text-white/40 font-ui text-[10px] font-bold uppercase tracking-widest leading-loose'>
                Shalom Hills International School<br />
                Sushant Lok Phase III<br />
                Gurugram, Haryana<br />
                India
              </p>
            </div>
          </div>

          <div className='pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8'>
            <p className='text-[10px] font-bold uppercase tracking-widest text-white/20'>
              {footerText || '© 2026 Harmonia MUN. All Rights Reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
