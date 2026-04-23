import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import ScheduleCard from './components/ScheduleCard';
import { useUCSFData } from './hooks/useUCSFData';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Activity,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Video,
  ExternalLink,
  Bell,
  Info,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  Mail,
  MapPin,
  Clock,
  Quote,
  Heart,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCommitteeSlug, setSelectedCommitteeSlug] = useState<string | null>(null);
  const [galleryYear, setGalleryYear] = useState<'all' | 2025 | 2026>('all');
  const [noticePriority, setNoticePriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);
  
  const {
    committees,
    members,
    rankings,
    sponsors,
    schedule,
    settings,
    gallery,
    notices,
    stagedChanges,
    profile,
    loading,
    error,
    refresh
  } = useUCSFData();

  const liveItems = useMemo(() => {
    return schedule.filter(s => {
      if (s.status === 'live') return true;
      if (s.status === 'completed') return false;

      try {
        const now = new Date();
        const startDate = new Date(`${s.day_date} ${s.time_start}`);
        if (isNaN(startDate.getTime())) return false;

        let endDate: Date | null = null;
        if (s.time_end) {
          endDate = new Date(`${s.day_date} ${s.time_end}`);
        }

        if (endDate) {
          return now >= startDate && now <= endDate;
        } else {
          const twoHoursLater = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          return now >= startDate && now <= twoHoursLater;
        }
      } catch (e) {
        return false;
      }
    });
  }, [schedule]);
  const upcomingItems = useMemo(() => schedule.filter(s => s.status === 'upcoming').slice(0, 3), [schedule]);

  const handleTabChange = (tab: string) => {
    if (tab !== 'committee') {
      setSelectedCommitteeSlug(null);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommitteeClick = (slug: string) => {
    setSelectedCommitteeSlug(slug);
    setActiveTab('committee');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-maple/20 border-t-maple rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-maple" size={24} />
          </div>
        </div>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-maple animate-pulse">Initializing Harmonia MUN…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark p-6 text-center">
        <div className="w-20 h-20 bg-cedar/10 text-cedar rounded-3xl flex items-center justify-center mb-6 border border-cedar/20">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-display text-white mb-4">Connection Error</h2>
        <p className="text-white/40 max-w-md mb-8 font-medium">
          {error}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => window.location.reload()} className="btn-primary">Retry Connection</button>
          <button onClick={() => refresh()} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-ui text-xs font-bold uppercase tracking-widest text-white transition-all">Refresh Data</button>
        </div>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'Harmonia MUN 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'United Nations Model Conference';
  const festivalDates = settings['festival_dates'] || 'October 2026 - Shalom Hills';
  const announcementText = settings['announcement_text'];
  const footerText = settings['footer_text'];
  const schoolLogoUrl = settings['school_logo_url'];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-0">
            {/* HERO */}
            <section className="relative py-32 md:py-56 overflow-hidden border-b border-border">
              <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-ebony opacity-[0.25] blur-[120px] rounded-full animate-[orbdrift_15s_ease-in-out_infinite_alternate]" />
              <div className="absolute bottom-[-100px] right-[-80px] w-[500px] h-[500px] bg-maple opacity-[0.18] blur-[120px] rounded-full animate-[orbdrift_18s_ease-in-out_infinite_alternate-reverse]" />
              
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 flex justify-center">
                   <div className="relative p-1 bg-gradient-to-br from-maple/50 to-transparent rounded-full backdrop-blur-sm">
                      <img
                        src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                        alt="School Logo"
                        className="h-24 md:h-32 object-contain rounded-full"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="hero-eyebrow mx-auto mb-6">
                  {festivalDates}
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-9xl font-display uppercase tracking-tighter leading-none mb-8">
                  {festivalName.split(' ')[0]}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-maple to-white">{festivalName.split(' ').slice(1).join(' ')}</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="hero-sub mb-16 max-w-2xl mx-auto">
                  {festivalSubtitle}
                </motion.p>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-6">
                  <button onClick={() => setActiveTab('about')} className="btn-primary group flex items-center gap-3 px-10">
                    Learn More
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setActiveTab('schedule')} className="btn-ghost px-10">Conference Flow</button>
                </motion.div>
              </div>
            </section>

            {/* LIVE BAR */}
            <div className="sticky top-[62px] z-40 bg-bg/90 backdrop-blur-md border-b border-border py-4 px-6 overflow-x-auto no-scrollbar">
              <div className="max-w-7xl mx-auto flex items-center gap-8 whitespace-nowrap">
                <div className="font-ui text-[11px] font-bold text-maple uppercase tracking-[4px] flex-shrink-0 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-maple animate-pulse" />
                  Live & Upcoming
                </div>
                <div className="h-4 w-px bg-border" />
                {liveItems.length > 0 ? (
                  liveItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-2 bg-maple/10 border border-maple/30 text-maple font-ui text-[11px] font-bold tracking-widest flex-shrink-0 rounded-full">
                      <Activity size={14} className="animate-pulse" />
                      LIVE: {item.title} — {item.venue}
                    </div>
                  ))
                ) : (
                  <div className="text-muted font-ui text-[11px] font-bold tracking-widest flex items-center gap-2">
                    <Clock size={14} />
                    Sessions resuming shortly
                  </div>
                )}
                {upcomingItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-5 py-2 bg-white/5 border border-border text-muted font-ui text-[11px] font-bold tracking-widest flex-shrink-0 rounded-full">
                    <span className="text-maple/50">{item.time_start}</span> {item.title}
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK STATS */}
            <section className="py-24 bg-bg">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { val: committees.length, label: 'Committees', icon: Layers },
                    { val: members.filter(m => m.category === 'EB').length, label: 'Executive Board', icon: ShieldCheck },
                    { val: '300+', label: 'Delegates', icon: Users },
                    { val: '2', label: 'Days of Debate', icon: Calendar },
                  ].map((stat, i) => (stat.icon &&
                    <div key={i} className="card-glass p-10 flex flex-col items-center text-center group hover:border-maple/30 transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-maple mb-6 group-hover:scale-110 transition-transform">
                        <stat.icon size={24} />
                      </div>
                      <div className="font-display text-5xl text-white leading-none mb-3">{stat.val}</div>
                      <div className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-muted">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* COMMITTEES PREVIEW */}
            <section className="py-24 bg-bg2/30 border-y border-border">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center">
                  <p className="sec-label justify-center">Committees</p>
                  <h2 className="text-5xl md:text-7xl mb-8">Debate Arenas</h2>
                  <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">From international security to human rights, explore our diverse committees and their agendas for Harmonia MUN 2026.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {committees.map((committee) => (
                    <motion.div 
                      key={committee.id}
                      whileHover={{ y: -10 }}
                      className="card-glass overflow-hidden group h-full flex flex-col cursor-pointer"
                      onClick={() => handleCommitteeClick(committee.slug)}
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-white/5">
                        {committee.image_url ? (
                          <img src={committee.image_url} alt={committee.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-maple/20">
                            <Sparkles size={64} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                           <h3 className="text-3xl font-display uppercase tracking-wider text-white mb-2">{committee.name}</h3>
                           <div className="h-1 w-12 bg-maple rounded-full" />
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <p className="text-muted/80 text-sm leading-relaxed mb-8 line-clamp-3">
                          {committee.description || "The committee agenda will be focused on addressing global challenges through diplomatic discourse and innovative solutions."}
                        </p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-maple flex items-center gap-2">
                             Explore Agenda <ChevronRight size={14} />
                          </span>
                          <span className="font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40">Harmonia 2026</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'about':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
            {/* Intro */}
            <section className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <p className="sec-label">Our Story</p>
                <h2 className="text-6xl md:text-8xl mb-10 leading-[0.9]">Beyond <span className="text-maple">Words</span>, Towards <span className="text-white">Action</span></h2>
                <div className="space-y-6 text-xl text-muted/80 leading-relaxed">
                  <p>Harmonia MUN is a premier Model United Nations conference hosted by Shalom Hills International School, bringing together the brightest minds to solve the world's most pressing challenges.</p>
                  <p>In its second chapter, Harmonia continues to be a platform for diplomacy, critical thinking, and global citizenship, fostering a new generation of leaders ready to shape the future.</p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[4rem] border border-border overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
                   <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" alt="About Harmonia" className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-maple/10 border border-maple/20 backdrop-blur-xl rounded-[2rem] p-8 flex flex-col justify-center -rotate-6">
                   <span className="text-4xl font-display text-maple">Chapter</span>
                   <span className="text-6xl font-display text-white">02</span>
                </div>
              </div>
            </section>

            {/* Vision/Mission/Values */}
            <section className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Vision', icon: Eye, content: settings['vision'] || 'To create a global community of empathetic leaders who bridge divides through diplomatic excellence and collaborative problem-solving.' },
                { title: 'Mission', icon: Target, content: settings['mission'] || 'Empowering students with the tools of research, public speaking, and negotiation to address international complexities with integrity.' },
                { title: 'Values', icon: Heart, content: settings['values'] || 'Integrity, Diplomacy, Global Citizenship, and Mutual Respect form the bedrock of every Harmonia MUN conference.' },
              ].map((item, i) => (
                <div key={i} className="card-glass p-12 space-y-8 group hover:border-maple/30 transition-all">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-maple group-hover:scale-110 transition-transform">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-display uppercase tracking-widest">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-lg">{item.content}</p>
                </div>
              ))}
            </section>

            {/* Messages */}
            <section className="space-y-20">
              <div className="text-center">
                 <p className="sec-label justify-center">Leadership</p>
                 <h2 className="text-5xl md:text-7xl">Voices of Guidance</h2>
              </div>
              <div className="grid gap-12">
                {[
                  { title: "Director's Message", key: 'director_msg', role: 'Director' },
                  { title: "Charge d'Affaires", key: 'charge_msg', role: "Charge d'Affaires" },
                  { title: "Board of Senior Advisors", key: 'board_msg', role: 'Board of Directors' }
                ].map((item) => {
                  const content = settings[item.key];
                  if (!content) return null;
                  return (
                    <div key={item.key} className="card-glass p-10 md:p-20 relative overflow-hidden group">
                      <Quote className="absolute top-10 right-10 text-white/5 w-40 h-40 -z-0" />
                      <div className="relative z-10 grid lg:grid-cols-3 gap-16 items-start">
                        <div className="lg:col-span-1 space-y-6">
                           <div className="aspect-square bg-white/5 rounded-3xl overflow-hidden border border-border">
                              <img src={members.find(m => m.role === item.role)?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"} alt={item.title} className="w-full h-full object-cover" />
                           </div>
                           <div className="text-center lg:text-left">
                              <h3 className="text-3xl font-display uppercase tracking-widest text-maple">{item.title}</h3>
                              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.4em] text-muted mt-2">{item.role}</p>
                           </div>
                        </div>
                        <div className="lg:col-span-2">
                           <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted/90">
                              <ReactMarkdown>{content}</ReactMarkdown>
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Secretariat & OC */}
            <section className="space-y-16 pb-20">
               <div className="text-center">
                  <p className="sec-label justify-center">The Team</p>
                  <h2 className="text-5xl md:text-7xl">Secretariat</h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {members.filter(m => m.category === 'Secretariat').map((member) => (
                    <div key={member.id} className="text-center space-y-4 group">
                       <div className="aspect-square bg-white/5 rounded-[2rem] overflow-hidden border border-border group-hover:border-maple/50 transition-all">
                          <img src={member.image_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                       </div>
                       <div>
                          <h4 className="font-display text-xl uppercase tracking-wider text-white">{member.name}</h4>
                          <p className="font-ui text-[9px] font-bold uppercase tracking-[0.3em] text-maple mt-1">{member.role}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        );

      case 'committee':
        const committee = committees.find(c => c.slug === selectedCommitteeSlug);
        if (!committee) return <div className="py-40 text-center text-muted">Committee not found</div>;

        const ebMembers = members.filter(m => m.committee_id === committee.id && m.category === 'EB');
        const ocMembers = members.filter(m => m.committee_id === committee.id && m.category === 'OC');

        return (
          <div className="space-y-0">
             {/* Header */}
             <section className="relative py-24 md:py-40 border-b border-border bg-bg-dark overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                   {committee.image_url && <img src={committee.image_url} alt="" className="w-full h-full object-cover blur-2xl scale-110" />}
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                   <div className="flex flex-col md:flex-row items-end gap-10">
                      <div className="w-48 h-48 bg-white/10 rounded-[2.5rem] border-2 border-maple/30 flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                         {committee.image_url ? (
                            <img src={committee.image_url} alt={committee.name} className="w-full h-full object-cover" />
                         ) : (
                            <Sparkles size={64} className="text-maple" />
                         )}
                      </div>
                      <div className="space-y-4 flex-1">
                         <p className="sec-label">Committee Profile</p>
                         <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter text-white">{committee.name}</h1>
                         <div className="flex flex-wrap gap-4 pt-4">
                            <span className="px-6 py-2 bg-maple/10 border border-maple/30 rounded-full text-maple font-ui text-[10px] font-bold uppercase tracking-[0.2em]">Harmonia 2026</span>
                            <span className="px-6 py-2 bg-white/5 border border-border rounded-full text-muted font-ui text-[10px] font-bold uppercase tracking-[0.2em]">Active Committee</span>
                         </div>
                      </div>
                   </div>
                </div>
             </section>

             <section className="py-24 max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-20">
                {/* Left: Content */}
                <div className="lg:col-span-2 space-y-24">
                   <div className="space-y-10">
                      <h2 className="text-4xl font-display uppercase tracking-wider flex items-center gap-4">
                         <Info size={32} className="text-maple" />
                         Committee Agenda
                      </h2>
                      <div className="prose prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted/80">
                         <ReactMarkdown>{committee.description || "Agenda description coming soon."}</ReactMarkdown>
                      </div>
                   </div>

                   {/* Background Guide */}
                   <div className="space-y-10">
                      <h2 className="text-4xl font-display uppercase tracking-wider flex items-center gap-4">
                         <FileText size={32} className="text-maple" />
                         Background Guide
                      </h2>
                      {committee.bg_guide_url ? (
                        <div className="aspect-[4/3] w-full card-glass overflow-hidden">
                           <iframe src={`${committee.bg_guide_url}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none" />
                        </div>
                      ) : (
                        <div className="p-20 text-center card-glass border-dashed">
                           <FileText size={48} className="mx-auto text-muted/20 mb-4" />
                           <p className="font-ui text-sm font-bold uppercase tracking-widest text-muted/40">Background Guide will be released soon</p>
                        </div>
                      )}
                   </div>

                   {/* Executive Board */}
                   <div className="space-y-10">
                      <h2 className="text-4xl font-display uppercase tracking-wider flex items-center gap-4">
                         <ShieldCheck size={32} className="text-maple" />
                         Executive Board
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-8">
                         {ebMembers.map(member => (
                           <div key={member.id} className="card-glass p-8 flex items-center gap-6 group hover:border-maple/30 transition-all">
                              <div className="w-20 h-20 bg-white/5 rounded-2xl overflow-hidden shrink-0 border border-border group-hover:scale-105 transition-transform">
                                 <img src={member.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                 <h4 className="text-xl font-display uppercase tracking-widest text-white">{member.name}</h4>
                                 <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-maple mt-1">{member.role}</p>
                              </div>
                           </div>
                         ))}
                         {ebMembers.length === 0 && <p className="text-muted/40 font-ui text-[10px] font-bold uppercase tracking-widest">EB members will be announced soon</p>}
                      </div>
                   </div>
                </div>

                {/* Right: Sidebar */}
                <div className="space-y-16">
                   {/* OC Members */}
                   <div className="space-y-8">
                      <h3 className="text-2xl font-display uppercase tracking-[0.2em] text-white border-b border-border pb-4">Organizing Committee</h3>
                      <div className="space-y-6">
                         {ocMembers.map(member => (
                           <div key={member.id} className="flex items-center gap-5 group">
                              <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-border group-hover:border-maple/50 transition-all">
                                 <img src={member.image_url || "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                              </div>
                              <div>
                                 <h4 className="font-ui text-[13px] font-bold uppercase tracking-wider text-white group-hover:text-maple transition-colors">{member.name}</h4>
                                 <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-muted/60 mt-1">{member.role}</p>
                              </div>
                           </div>
                         ))}
                         {ocMembers.length === 0 && <p className="text-muted/40 font-ui text-[10px] font-bold uppercase tracking-widest italic">OC members designated for this committee will appear here.</p>}
                      </div>
                   </div>

                   {/* Quick Links */}
                   <div className="card-glass p-8 space-y-6">
                      <h3 className="text-xl font-display uppercase tracking-widest text-maple">Resources</h3>
                      <div className="space-y-3">
                         <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-border rounded-xl font-ui text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-all flex items-center justify-between px-6">
                            Delegate Handbook <ExternalLink size={14} />
                         </button>
                         <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-border rounded-xl font-ui text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-all flex items-center justify-between px-6">
                            Rules of Procedure <ExternalLink size={14} />
                         </button>
                      </div>
                   </div>
                </div>
             </section>
          </div>
        );

      case 'schedule':
        const days = Array.from(new Set(schedule.map(s => s.day_label)));
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
             <div className="mb-20 text-center">
                <p className="sec-label justify-center">Conference Flow</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter">The Timeline</h2>
                <p className="text-muted mt-6 text-xl max-w-2xl mx-auto">Track the evolution of debate across both days of Harmonia MUN 2026.</p>
             </div>

             <div className="space-y-32">
              {days.map(day => (
                <div key={day} className="space-y-16">
                  <div className="flex items-end gap-6 border-b border-border pb-8">
                    <h3 className="text-5xl text-maple uppercase tracking-wider font-display">{day}</h3>
                    <span className="font-ui text-sm font-bold uppercase tracking-[0.4em] text-muted mb-2 pb-1">
                      {schedule.find(s => s.day_label === day)?.day_date}
                    </span>
                  </div>
                  <div className="timeline">
                    {schedule.filter(s => s.day_label === day).map((item, idx) => (
                      <div key={item.id} className="relative pl-12 sm:pl-24 pb-16 last:pb-0 group">
                         {/* Line */}
                         <div className="absolute left-[11px] sm:left-[23px] top-0 bottom-0 w-px bg-border group-last:bottom-auto group-last:h-8" />
                         {/* Dot */}
                         <div className={cn(
                            "absolute left-0 sm:left-3 top-2 w-6 h-6 rounded-full border-4 border-bg z-10 transition-all duration-500",
                            item.status === 'live' ? "bg-maple scale-125 shadow-[0_0_15px_rgba(188,138,44,0.6)]" :
                            item.status === 'completed' ? "bg-cedar opacity-50" : "bg-white/10"
                         )} />

                         <div className="grid sm:grid-cols-4 gap-8">
                            <div className="sm:col-span-1">
                               <div className="font-display text-2xl text-white group-hover:text-maple transition-colors">{item.time_start}</div>
                               <div className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] mt-1">{item.time_end ? `until ${item.time_end}` : 'Start'}</div>
                            </div>
                            <div className="sm:col-span-3 card-glass p-8 group-hover:border-maple/30 transition-all">
                               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                  <div>
                                     <h4 className="text-2xl font-display uppercase tracking-wider text-white mb-2">{item.title}</h4>
                                     <p className="text-muted font-medium">{item.subtitle}</p>
                                  </div>
                                  <div className={cn(
                                     "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                                     item.status === 'live' ? "bg-maple/10 border-maple/30 text-maple animate-pulse" :
                                     item.status === 'completed' ? "bg-white/5 border-white/10 text-muted/40" :
                                     "bg-white/5 border-white/10 text-muted"
                                  )}>
                                     {item.status}
                                  </div>
                               </div>
                               <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
                                  <div className="flex items-center gap-2 text-muted/60 font-ui text-[10px] font-bold uppercase tracking-widest">
                                     <MapPin size={14} className="text-maple/50" />
                                     {item.venue}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rankings':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
             <div className="mb-20 text-center">
                <p className="sec-label justify-center">Hall of Fame</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter">Conference Awards</h2>
                <p className="text-muted mt-6 text-xl max-w-2xl mx-auto">Celebrating diplomatic excellence and exceptional contribution to the conference.</p>
             </div>

             <div className="space-y-24">
                {committees.map(committee => {
                  const committeeRankings = rankings.filter(r => r.committee_id === committee.id);
                  if (committeeRankings.length === 0) return null;

                  return (
                    <div key={committee.id} className="space-y-12">
                       <div className="flex items-center gap-6">
                          <h3 className="text-3xl font-display uppercase tracking-widest text-maple">{committee.name}</h3>
                          <div className="h-px flex-1 bg-border" />
                       </div>
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {committeeRankings.map(ranking => (
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={ranking.id} className="card-glass p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Award size={80} />
                               </div>
                               <div className="w-16 h-16 bg-maple/10 rounded-2xl flex items-center justify-center text-maple mb-2 shadow-inner">
                                  <Trophy size={32} />
                               </div>
                               <div>
                                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-maple mb-2">{ranking.award}</p>
                                  <h4 className="text-3xl font-display uppercase tracking-wider text-white">{ranking.name}</h4>
                                  <p className="text-muted font-medium mt-2">{ranking.school}</p>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  );
                })}
                {rankings.length === 0 && (
                  <div className="py-40 text-center card-glass border-dashed">
                     <Sparkles size={48} className="mx-auto text-muted/20 mb-4" />
                     <p className="font-ui text-sm font-bold uppercase tracking-widest text-muted/40 italic">Awards will be announced following the closing ceremony.</p>
                  </div>
                )}
             </div>
          </div>
        );

      case 'notices':
        const filteredNotices = notices.filter(n => noticePriority === 'all' || n.priority === noticePriority);
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
              <div className="max-w-2xl">
                <p className="sec-label">Bulletin</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none">Notices</h2>
                <p className="text-muted mt-6 text-xl">Official announcements and real-time updates for all participants.</p>
              </div>
              
              <div className="flex items-center flex-nowrap gap-2 bg-white/5 p-1.5 border border-border rounded-2xl overflow-x-auto no-scrollbar">
                {['all', 'high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNoticePriority(p as any)}
                    className={cn(
                      "px-8 py-3 font-ui text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl whitespace-nowrap",
                      noticePriority === p ? "bg-maple text-bg shadow-xl" : "text-muted hover:text-text"
                    )}
                  >
                    {p === 'all' ? 'All Alerts' : `${p} priority`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-8">
              <AnimatePresence mode="popLayout">
                {filteredNotices.map((notice) => (
                  <motion.div 
                    key={notice.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "card-glass p-10 group hover:border-maple/30 transition-all cursor-pointer relative overflow-hidden",
                      expandedNoticeId === notice.id && "border-maple/50"
                    )}
                    onClick={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}
                  >
                    {notice.priority === 'high' && <div className="absolute top-0 left-0 w-full h-1 bg-danger" />}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-3 h-3 rounded-full animate-pulse",
                          notice.priority === 'high' ? "bg-danger shadow-[0_0_10px_rgba(230,57,70,0.8)]" :
                          notice.priority === 'medium' ? "bg-maple" : "bg-muted"
                        )} />
                        <span className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
                          {new Date(notice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-maple p-2 bg-white/5 rounded-full group-hover:bg-maple/10 transition-colors">
                        {expandedNoticeId === notice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-display tracking-tight uppercase mb-6 leading-tight group-hover:text-maple transition-colors">{notice.title}</h3>
                    
                    <AnimatePresence>
                      {expandedNoticeId === notice.id ? (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="prose prose-invert max-w-none prose-p:text-muted prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-maple prose-a:text-maple hover:prose-a:underline mt-8 pt-8 border-t border-white/10">
                            <ReactMarkdown>{notice.content}</ReactMarkdown>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-muted text-lg leading-relaxed line-clamp-2 max-w-3xl">{notice.content}</p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredNotices.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center card-glass">
                  <Bell size={64} className="mx-auto text-muted/20 mb-6" />
                  <p className="font-ui text-sm font-bold text-muted uppercase tracking-[0.4em]">No active notices in this category</p>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'gallery':
        const filteredGallery = gallery.filter(item => galleryYear === 'all' || item.year === galleryYear);
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="max-w-2xl">
                <p className="sec-label">Moments</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter">Gallery</h2>
                <p className="text-muted mt-6 text-xl">Visual highlights from the Harmonia MUN series.</p>
              </div>
              
              <div className="flex items-center flex-nowrap gap-2 bg-white/5 p-1.5 border border-border rounded-2xl overflow-x-auto no-scrollbar">
                {['all', 2026, 2025].map((year) => (
                  <button
                    key={year}
                    onClick={() => setGalleryYear(year as any)}
                    className={cn(
                      "px-8 py-3 font-ui text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl whitespace-nowrap",
                      galleryYear === year ? "bg-maple text-bg shadow-xl" : "text-muted hover:text-text"
                    )}
                  >
                    {year === 'all' ? 'All Editions' : `Edition ${year}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="card-glass overflow-hidden group cursor-pointer"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-white/5">
                      {item.type === 'image' ? (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-ebony flex items-center justify-center text-maple">
                          <Play size={64} className="group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      <div className="absolute top-6 left-6 z-20 bg-bg/80 backdrop-blur-md border border-border px-4 py-1.5 rounded-full font-ui text-[9px] font-bold uppercase tracking-widest text-maple">
                        {item.year || 2026}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-8">
                        <div className="flex items-center gap-3 text-white font-ui text-[10px] font-bold uppercase tracking-widest">
                          {item.type === 'image' ? <ImageIcon size={18} /> : <Video size={18} />}
                          View {item.type}
                        </div>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-display tracking-tight uppercase truncate group-hover:text-maple transition-colors">{item.title || "Conference Moment"}</h3>
                      <p className="font-ui text-[9px] font-bold text-muted/40 uppercase tracking-[0.3em] mt-3">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'sponsors':
        const sponsorsByTier: Record<string, typeof sponsors> = {};
        sponsors.forEach(s => {
          if (!sponsorsByTier[s.tier]) sponsorsByTier[s.tier] = [];
          sponsorsByTier[s.tier].push(s);
        });
        const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner'];

        return (
          <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
             <div className="text-center">
                <p className="sec-label justify-center">Partners</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter">Our Sponsors</h2>
                <p className="text-muted mt-6 text-xl max-w-2xl mx-auto">Gratitude to our partners who make Harmonia MUN Chapter 2 possible.</p>
             </div>

             <div className="space-y-24">
                {tiers.map(tier => {
                  const tierSponsors = sponsorsByTier[tier];
                  if (!tierSponsors || tierSponsors.length === 0) return null;

                  return (
                    <div key={tier} className="space-y-12">
                       <div className="flex items-center gap-8">
                          <div className="h-px flex-1 bg-border" />
                          <h3 className={cn(
                             "text-3xl font-display uppercase tracking-[0.4em]",
                             tier === 'Platinum' ? "text-white" : tier === 'Gold' ? "text-maple" : "text-muted"
                          )}>{tier} Sponsors</h3>
                          <div className="h-px flex-1 bg-border" />
                       </div>
                       <div className="flex flex-wrap justify-center gap-12">
                          {tierSponsors.map(sponsor => (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              key={sponsor.id}
                              href={sponsor.website_url || '#'}
                              target="_blank"
                              className="group p-10 bg-white/5 border border-border rounded-[3rem] hover:border-maple/30 transition-all flex items-center justify-center w-72 h-48"
                            >
                               {sponsor.logo_url ? (
                                 <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-60 group-hover:opacity-100" />
                               ) : (
                                 <span className="font-display text-2xl uppercase tracking-widest text-muted group-hover:text-white transition-colors">{sponsor.name}</span>
                               )}
                            </motion.a>
                          ))}
                       </div>
                    </div>
                  );
                })}
             </div>
             {sponsors.length === 0 && (
                <div className="py-40 text-center card-glass border-dashed">
                   <p className="font-ui text-sm font-bold uppercase tracking-widest text-muted/40">Sponsorship opportunities available for Chapter 2</p>
                </div>
             )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange}
      title={festivalName}
      subtitle={festivalSubtitle}
      announcement={announcementText}
      footerText={footerText}
      schoolLogoUrl={schoolLogoUrl}
      profile={profile}
      committees={committees}
      onCommitteeClick={handleCommitteeClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + (selectedCommitteeSlug || '')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
