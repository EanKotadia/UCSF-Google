import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import ScheduleCard from './components/ScheduleCard';
import { useUCSFData } from './hooks/useUCSFData';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Calendar,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Info,
  FileText,
  ChevronDown,
  ChevronUp,
  Users,
  MapPin,
  Clock,
  Quote,
  Heart,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Eye,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCommitteeSlug, setSelectedCommitteeSlug] = useState<string | null>(null);
  
  const {
    committees,
    members,
    rankings,
    sponsors,
    schedule,
    settings,
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
        if (s.time_end) endDate = new Date(`${s.day_date} ${s.time_end}`);
        if (endDate) return now >= startDate && now <= endDate;
        return now >= startDate && now <= new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
      } catch (e) { return false; }
    });
  }, [schedule]);

  const upcomingItems = useMemo(() => schedule.filter(s => s.status === 'upcoming').slice(0, 3), [schedule]);

  const handleTabChange = (tab: string) => {
    if (tab !== 'committee') setSelectedCommitteeSlug(null);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-maple/10 border-t-maple rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-maple animate-pulse" size={24} />
          </div>
        </div>
        <div className="text-center space-y-2">
           <p className="font-display text-lg uppercase tracking-[0.4em] text-white">Harmonia MUN</p>
           <p className="font-ui text-[8px] font-bold uppercase tracking-[0.6em] text-maple">Shalom Hills Chapter 02</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6 text-center">
        <div className="w-24 h-24 bg-danger/5 text-danger rounded-[2.5rem] flex items-center justify-center mb-8 border border-danger/10 shadow-2xl">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-4xl font-display text-white mb-4 uppercase tracking-wider">System Offline</h2>
        <p className="text-white/40 max-w-md mb-10 font-medium leading-relaxed">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary px-12 py-5 uppercase font-bold tracking-widest">Re-establish Connection</button>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'Harmonia MUN 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Empowering Global Diplomacy • Shalom Hills Chapter 02';
  const festivalDates = settings['festival_dates'] || 'OCTOBER 2026 • GURUGRAM, INDIA';
  const announcementText = settings['announcement_text'];
  const footerText = settings['footer_text'];
  const schoolLogoUrl = settings['school_logo_url'];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-0">
            {/* HERO */}
            <section className="relative min-h-[90vh] flex items-center justify-center py-32 overflow-hidden">
              <div className="absolute inset-0 z-0">
                 <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-ebony opacity-[0.2] blur-[150px] rounded-full animate-[orbdrift_20s_ease-in-out_infinite_alternate]" />
                 <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-maple opacity-[0.15] blur-[150px] rounded-full animate-[orbdrift_25s_ease-in-out_infinite_alternate-reverse]" />
              </div>
              
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-12">
                   <div className="flex flex-col items-center gap-6">
                      <div className="hero-eyebrow mx-auto border-maple/30 text-maple backdrop-blur-md">
                        {festivalDates}
                      </div>
                      <h1 className="text-7xl md:text-[10rem] font-display uppercase tracking-tighter leading-[0.85] text-white">
                        {festivalName.split(' ')[0]}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-maple via-white to-maple/50">{festivalName.split(' ').slice(1).join(' ')}</span>
                      </h1>
                   </div>

                   <p className="text-xl md:text-2xl text-muted font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
                     {festivalSubtitle}
                   </p>

                   <div className="flex flex-wrap justify-center gap-6 pt-6">
                     <button onClick={() => handleTabChange('about')} className="btn-primary group flex items-center gap-4 px-12 py-6 text-sm">
                       Explore Conference
                       <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                     </button>
                     <button onClick={() => handleTabChange('schedule')} className="btn-ghost px-12 py-6 text-sm border-white/10 hover:border-maple/50">Conference Flow</button>
                   </div>
                </motion.div>
              </div>
            </section>

            {/* LIVE BAR */}
            <div className="sticky top-[62px] z-40 bg-bg/95 backdrop-blur-xl border-y border-white/5 py-5 px-6 overflow-x-auto no-scrollbar">
              <div className="max-w-7xl mx-auto flex items-center gap-10 whitespace-nowrap">
                <div className="font-ui text-[10px] font-black text-maple uppercase tracking-[5px] flex-shrink-0 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-maple animate-pulse shadow-[0_0_10px_rgba(188,138,44,0.8)]" />
                  Live Feed
                </div>
                <div className="h-4 w-px bg-white/10" />
                {liveItems.length > 0 ? (
                  liveItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 px-6 py-2.5 bg-maple/10 border border-maple/30 text-maple font-ui text-[11px] font-bold tracking-widest flex-shrink-0 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maple opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-maple"></span>
                      </span>
                      {item.title} • {item.venue}
                    </div>
                  ))
                ) : (
                  <div className="text-muted/60 font-ui text-[11px] font-bold tracking-[0.2em] flex items-center gap-3 italic">
                    <Clock size={16} className="opacity-30" />
                    Next session starting as per schedule
                  </div>
                )}
                {upcomingItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-6 py-2.5 bg-white/2 border border-white/5 text-muted/80 font-ui text-[11px] font-bold tracking-widest flex-shrink-0 rounded-full">
                    <span className="text-maple/50 font-black">{item.time_start}</span> {item.title}
                  </div>
                ))}
              </div>
            </div>

            {/* CONFERENCE STATS */}
            <section className="py-32 bg-bg relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                  {[
                    { val: committees.length, label: 'Committees', icon: Layers },
                    { val: members.filter(m => m.category === 'EB').length, label: 'Exec Board', icon: ShieldCheck },
                    { val: '350+', label: 'Delegates', icon: Users },
                    { val: 'Chapter 02', label: 'Edition', icon: Sparkles },
                  ].map((stat, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="card-glass p-12 flex flex-col items-center text-center group hover:border-maple/40 transition-all shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-maple mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <stat.icon size={28} />
                      </div>
                      <div className="font-display text-6xl text-white leading-none mb-4 group-hover:text-maple transition-colors">{stat.val}</div>
                      <div className="font-ui text-[11px] font-black uppercase tracking-[0.4em] text-muted/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* COMMITTEES SHOWCASE */}
            <section className="py-32 bg-bg2/40 border-y border-white/5 relative">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 text-center space-y-6">
                  <div className="sec-label justify-center">Committees 2026</div>
                  <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter text-white">The Battlegrounds of <span className="text-maple">Diplomacy</span></h2>
                  <p className="text-muted max-w-2xl mx-auto text-xl leading-relaxed opacity-70">Diverse agendas designed to challenge the brightest minds through rigorous debate and international collaboration.</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {committees.map((committee, i) => (
                    <motion.div 
                      key={committee.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -15 }}
                      className="card-glass overflow-hidden group h-full flex flex-col cursor-pointer border-white/5 hover:border-maple/30 transition-all duration-500 shadow-2xl"
                      onClick={() => handleCommitteeClick(committee.slug)}
                    >
                      <div className="aspect-[16/10] relative overflow-hidden bg-bg">
                        {committee.image_url ? (
                          <img src={committee.image_url} alt={committee.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-maple/10 bg-gradient-to-br from-bg to-ebony">
                            <Layers size={100} className="group-hover:scale-110 transition-transform duration-700" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                           <h3 className="text-4xl font-display uppercase tracking-wider text-white mb-3 group-hover:text-maple transition-colors">{committee.name}</h3>
                           <div className="h-1 w-16 bg-maple rounded-full origin-left group-hover:w-full transition-all duration-700" />
                        </div>
                      </div>
                      <div className="p-10 flex-grow flex flex-col space-y-8">
                        <p className="text-muted/80 text-base leading-relaxed line-clamp-3 font-medium">
                          {committee.description?.replace(/[#*]/g, '').slice(0, 150) || "The committee agenda will be focused on addressing global challenges through diplomatic discourse and innovative solutions."}...
                        </p>
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                          <span className="font-ui text-[11px] font-black uppercase tracking-[0.3em] text-maple flex items-center gap-3 group-hover:gap-5 transition-all">
                             View Agenda <ArrowRight size={16} />
                          </span>
                          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted/30">H-MUN 26</span>
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
          <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
            {/* HERITAGE */}
            <section className="grid lg:grid-cols-2 gap-32 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                   <p className="sec-label">Our Philosophy</p>
                   <h2 className="text-7xl md:text-9xl font-display uppercase tracking-tighter leading-[0.8] text-white">Beyond <span className="text-maple">Words</span>, Towards <span className="text-white">Action</span></h2>
                </div>
                <div className="space-y-8 text-2xl text-muted/70 leading-relaxed font-medium">
                  <p>Harmonia MUN, an initiative by <strong className="text-white">Shalom Hills International School</strong>, stands as a testament to our commitment to nurturing global leaders.</p>
                  <p>In its second chapter, we invite delegates to transcend traditional debate, focusing instead on pragmatic solutions for a complex world. Our conference is built on the pillars of academic integrity, diplomatic excellence, and mutual respect.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="aspect-[4/5] bg-ebony rounded-[5rem] border border-white/5 overflow-hidden transition-all duration-1000 group-hover:rounded-[3rem] shadow-3xl">
                   <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80" alt="Diplomacy" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100" />
                </div>
                <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-maple/10 border border-maple/20 backdrop-blur-2xl rounded-[3rem] p-12 flex flex-col justify-center shadow-3xl group-hover:scale-110 transition-transform duration-700">
                   <span className="text-3xl font-display text-maple uppercase tracking-widest">CHAPTER</span>
                   <span className="text-[7rem] font-display text-white leading-none mt-2">02</span>
                </div>
              </div>
            </section>

            {/* VISION MISSION VALUES */}
            <section className="grid md:grid-cols-3 gap-12">
              {[
                { title: 'Vision', icon: Eye, content: settings['vision'] || 'To foster a global community of empathetic leaders capable of navigating international complexities through the lens of diplomacy and collaborative problem-solving.' },
                { title: 'Mission', icon: Target, content: settings['mission'] || 'Empowering the youth with critical research skills and persuasive communication to advocate for sustainable global progress and humanitarian values.' },
                { title: 'Values', icon: Heart, content: settings['values'] || 'Unwavering Integrity, Inclusive Diplomacy, Global Citizenship, and Mutual Respect form the foundation of the Harmonia legacy.' },
              ].map((item, i) => (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={i} className="card-glass p-16 space-y-10 group hover:border-maple/40 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <item.icon size={120} />
                  </div>
                  <div className="w-20 h-20 bg-maple/10 rounded-[2rem] flex items-center justify-center text-maple group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                    <item.icon size={36} />
                  </div>
                  <h3 className="text-4xl font-display uppercase tracking-widest text-white">{item.title}</h3>
                  <p className="text-muted leading-relaxed text-xl font-medium opacity-80">{item.content}</p>
                </motion.div>
              ))}
            </section>

            {/* NAVIGATOR & STUDENT LEADERSHIP MESSAGES */}
            <section className="space-y-32">
              <div className="text-center space-y-6">
                 <p className="sec-label justify-center">Leadership Voices</p>
                 <h2 className="text-6xl md:text-8xl font-display uppercase text-white tracking-tighter">Messages of <span className="text-maple">Inspiration</span></h2>
              </div>
              <div className="space-y-24">
                {[
                  { title: "Navigator's Message", key: 'navigator_msg', category: 'Navigator' },
                  { title: "Director's Message", key: 'director_msg', category: 'Director' },
                  { title: "Charge d'Affaires' Message", key: 'charge_msg', category: "Charge d'Affaires" }
                ].map((item, i) => {
                  const content = settings[item.key];
                  const leader = members.find(m => m.category === item.category);
                  if (!content) return null;
                  return (
                    <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} key={item.key} className={cn(
                      "card-glass p-10 md:p-24 relative overflow-hidden group shadow-3xl flex flex-col lg:flex-row gap-20",
                      i % 2 !== 0 && "lg:flex-row-reverse"
                    )}>
                      <Quote className="absolute top-10 right-10 text-white/5 w-64 h-64 -z-0 pointer-events-none" />
                      <div className="lg:w-1/3 space-y-8 relative z-10 shrink-0">
                         <div className="aspect-square bg-bg rounded-[3rem] overflow-hidden border-2 border-white/5 group-hover:border-maple/30 transition-all duration-700 shadow-2xl">
                            <img src={leader?.image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"} alt={leader?.name || item.title} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-110 group-hover:scale-100" />
                         </div>
                         <div className="space-y-2 text-center lg:text-left">
                            <h3 className="text-4xl font-display uppercase tracking-widest text-maple">{leader?.name || item.title}</h3>
                            <p className="font-ui text-[11px] font-black uppercase tracking-[0.5em] text-muted/60">{leader?.role || item.category}</p>
                         </div>
                      </div>
                      <div className="lg:w-2/3 relative z-10 flex flex-col justify-center">
                         <div className="prose prose-invert max-w-none prose-p:text-2xl prose-p:leading-relaxed prose-p:text-muted/90 prose-strong:text-white prose-em:text-maple/80">
                            <ReactMarkdown>{content}</ReactMarkdown>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* SECRETARIAT */}
            <section className="space-y-24 pb-20">
               <div className="text-center space-y-6">
                  <p className="sec-label justify-center">The Secretariat</p>
                  <h2 className="text-6xl md:text-8xl font-display uppercase text-white tracking-tighter">Diplomatic <span className="text-maple">Core</span></h2>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
                  {members.filter(m => m.category === 'EB' && !m.committee_id).map((member, i) => (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} key={member.id} className="text-center space-y-6 group">
                       <div className="aspect-square bg-bg rounded-[3rem] overflow-hidden border border-white/5 group-hover:border-maple/50 transition-all duration-500 shadow-xl relative">
                          <img src={member.image_url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-maple transition-colors">{member.name}</h4>
                          <p className="font-ui text-[10px] font-black uppercase tracking-[0.3em] text-muted/50">{member.role}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </section>
          </div>
        );

      case 'committee':
        const committee = committees.find(c => c.slug === selectedCommitteeSlug);
        if (!committee) return <div className="py-60 text-center text-muted font-display uppercase tracking-widest text-2xl">Agenda Pending Deployment</div>;

        const ebMembers = members.filter(m => m.committee_id === committee.id && m.category === 'EB');
        const ocMembers = members.filter(m => m.committee_id === committee.id && m.category === 'OC');

        return (
          <div className="space-y-0">
             {/* Header */}
             <section className="relative py-32 md:py-56 border-b border-white/5 bg-bg-dark overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                   {committee.image_url && <img src={committee.image_url} alt="" className="w-full h-full object-cover blur-[100px] scale-125" />}
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                   <div className="flex flex-col md:flex-row items-center md:items-end gap-16">
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-64 h-64 bg-ebony rounded-[4rem] border-2 border-maple/20 flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(188,138,44,0.15)] overflow-hidden relative group">
                         {committee.image_url ? (
                            <img src={committee.image_url} alt={committee.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                         ) : (
                            <Layers size={80} className="text-maple/20" />
                         )}
                         <div className="absolute inset-0 border-[20px] border-bg/20 pointer-events-none" />
                      </motion.div>
                      <div className="space-y-8 flex-1 text-center md:text-left">
                         <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="px-6 py-2 bg-maple/10 border border-maple/30 rounded-full text-maple font-ui text-[10px] font-black uppercase tracking-[0.3em]">COMMITTEE PROFILE</span>
                            <span className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-muted font-ui text-[10px] font-black uppercase tracking-[0.3em]">H-MUN 2026</span>
                         </div>
                         <h1 className="text-6xl md:text-[8rem] font-display uppercase tracking-tighter text-white leading-[0.85]">{committee.name}</h1>
                      </div>
                   </div>
                </div>
             </section>

             <section className="py-32 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-24">
                {/* Left: Content */}
                <div className="lg:col-span-8 space-y-32">
                   <div className="space-y-12">
                      <h2 className="text-5xl font-display uppercase tracking-widest flex items-center gap-6 text-white">
                         <div className="w-12 h-12 bg-maple/10 rounded-xl flex items-center justify-center text-maple shadow-inner"><Info size={24} /></div>
                         Agendum
                      </h2>
                      <div className="prose prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted/80 prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-strong:text-maple prose-ul:list-square">
                         <ReactMarkdown>{committee.description || "Agenda details for this committee are being finalized by the Secretariat."}</ReactMarkdown>
                      </div>
                   </div>

                   {/* Background Guide */}
                   <div className="space-y-12">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                         <h2 className="text-5xl font-display uppercase tracking-widest flex items-center gap-6 text-white">
                            <div className="w-12 h-12 bg-maple/10 rounded-xl flex items-center justify-center text-maple shadow-inner"><FileText size={24} /></div>
                            Strategic Guide
                         </h2>
                         {committee.bg_guide_url && (
                            <a href={committee.bg_guide_url} target="_blank" rel="noreferrer" className="btn-primary flex items-center gap-3 px-8 py-4 text-[10px] font-black tracking-widest">
                               <ArrowRight size={14} className="-rotate-45" /> DOWNLOAD PDF
                            </a>
                         )}
                      </div>
                      {committee.bg_guide_url ? (
                        <div className="aspect-[3/4] md:aspect-[16/10] w-full bg-ebony rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl">
                           <iframe src={`${committee.bg_guide_url}#toolbar=0&view=FitH`} className="w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="p-32 text-center card-glass border-dashed rounded-[3rem]">
                           <FileText size={64} className="mx-auto text-white/5 mb-8 animate-pulse" />
                           <p className="font-ui text-lg font-bold uppercase tracking-[0.4em] text-muted/30 italic">The Background Guide is undergoing final review by the Executive Board.</p>
                        </div>
                      )}
                   </div>

                   {/* Executive Board */}
                   <div className="space-y-12">
                      <h2 className="text-5xl font-display uppercase tracking-widest flex items-center gap-6 text-white">
                         <div className="w-12 h-12 bg-maple/10 rounded-xl flex items-center justify-center text-maple shadow-inner"><ShieldCheck size={24} /></div>
                         The Executive Board
                      </h2>
                      <div className="grid sm:grid-cols-2 gap-10">
                         {ebMembers.map(member => (
                           <motion.div whileHover={{ scale: 1.02 }} key={member.id} className="card-glass p-10 flex items-center gap-8 group hover:border-maple/30 transition-all shadow-xl">
                              <div className="w-24 h-24 bg-bg rounded-[2rem] overflow-hidden shrink-0 border border-white/5 group-hover:border-maple/50 transition-all shadow-inner">
                                 <img src={member.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-2xl font-display uppercase tracking-wider text-white group-hover:text-maple transition-colors">{member.name}</h4>
                                 <p className="font-ui text-[10px] font-black uppercase tracking-[0.3em] text-muted/60">{member.role}</p>
                              </div>
                           </motion.div>
                         ))}
                         {ebMembers.length === 0 && <p className="text-muted/30 font-ui text-sm font-bold uppercase tracking-[0.3em] italic px-4">Board members will be announced following departmental approval.</p>}
                      </div>
                   </div>
                </div>

                {/* Right: Sidebar */}
                <div className="lg:col-span-4 space-y-20">
                   {/* OC Members */}
                   <div className="space-y-10">
                      <div className="flex items-center gap-4">
                         <h3 className="text-2xl font-display uppercase tracking-[0.3em] text-white">The OC</h3>
                         <div className="h-px flex-1 bg-white/10" />
                      </div>
                      <div className="space-y-8">
                         {ocMembers.map(member => (
                           <div key={member.id} className="flex items-center gap-6 group">
                              <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] overflow-hidden shrink-0 border border-white/5 group-hover:border-maple/40 transition-all shadow-lg">
                                 <img src={member.image_url || "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80"} alt={member.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="font-ui text-[14px] font-black uppercase tracking-widest text-white/90 group-hover:text-maple transition-colors">{member.name}</h4>
                                 <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50">{member.role}</p>
                              </div>
                           </div>
                         ))}
                         {ocMembers.length === 0 && <p className="text-muted/30 font-ui text-[10px] font-black uppercase tracking-[0.2em] italic">Internal Committee OC assignments in progress.</p>}
                      </div>
                   </div>

                   {/* Quick Links */}
                   <div className="card-glass p-12 space-y-10 bg-gradient-to-br from-white/5 to-transparent border-white/5">
                      <h3 className="text-2xl font-display uppercase tracking-widest text-maple">Protocol</h3>
                      <div className="space-y-4">
                         <button className="w-full py-5 bg-bg/50 hover:bg-white/5 border border-white/5 rounded-2xl font-ui text-[11px] font-black uppercase tracking-[0.3em] text-muted hover:text-white transition-all flex items-center justify-between px-8 group">
                            Delegate Charter <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                         </button>
                         <button className="w-full py-5 bg-bg/50 hover:bg-white/5 border border-white/5 rounded-2xl font-ui text-[11px] font-black uppercase tracking-[0.3em] text-muted hover:text-white transition-all flex items-center justify-between px-8 group">
                            Rules of Procedure <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
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
          <div className="max-w-7xl mx-auto px-6 py-32">
             <div className="mb-32 text-center space-y-8">
                <p className="sec-label justify-center">The Event Flow</p>
                <h2 className="text-7xl md:text-[10rem] font-display uppercase tracking-tighter leading-none text-white">Conference <span className="text-maple">Timeline</span></h2>
                <p className="text-muted mt-6 text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-60">Real-time status updates for all sessions of Harmonia MUN Chapter 02.</p>
             </div>

             <div className="space-y-48">
              {days.map(day => (
                <div key={day} className="space-y-24">
                  <div className="flex items-end gap-10 border-b-2 border-white/5 pb-12">
                    <h3 className="text-7xl text-maple uppercase tracking-widest font-display leading-none">{day}</h3>
                    <div className="flex flex-col gap-2">
                       <span className="font-ui text-sm font-black uppercase tracking-[0.5em] text-white/40">CALENDAR DATE</span>
                       <span className="font-ui text-lg font-bold text-white uppercase tracking-[0.2em]">
                         {schedule.find(s => s.day_label === day)?.day_date}
                       </span>
                    </div>
                  </div>
                  <div className="timeline">
                    {schedule.filter(s => s.day_label === day).map((item, idx) => (
                      <ScheduleCard key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rankings':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
             <div className="mb-32 text-center space-y-8">
                <p className="sec-label justify-center">The Hall of Fame</p>
                <h2 className="text-7xl md:text-[10rem] font-display uppercase tracking-tighter leading-none text-white">Honoring <span className="text-maple">Excellence</span></h2>
                <p className="text-muted mt-6 text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-60">Celebrating the pinnacle of diplomacy and collaborative resolution from Chapter 02.</p>
             </div>

             <div className="space-y-32">
                {committees.map(committee => {
                  const committeeRankings = rankings.filter(r => r.committee_id === committee.id);
                  if (committeeRankings.length === 0) return null;

                  return (
                    <div key={committee.id} className="space-y-16">
                       <div className="flex items-center gap-10">
                          <h3 className="text-4xl font-display uppercase tracking-[0.3em] text-maple shrink-0">{committee.name}</h3>
                          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                       </div>
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                          {committeeRankings.map((ranking, i) => (
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} key={ranking.id} className="card-glass p-12 flex flex-col items-center text-center space-y-8 relative overflow-hidden group shadow-2xl border-white/5 hover:border-maple/40 transition-all">
                               <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                  <Award size={120} />
                               </div>
                               <div className="w-20 h-20 bg-maple/10 rounded-[2rem] flex items-center justify-center text-maple group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                                  <Trophy size={36} />
                               </div>
                               <div className="space-y-4">
                                  <p className="font-ui text-[11px] font-black uppercase tracking-[0.5em] text-maple group-hover:tracking-[0.7em] transition-all duration-700">{ranking.award}</p>
                                  <h4 className="text-4xl font-display uppercase tracking-wider text-white">{ranking.name}</h4>
                                  <div className="h-1 w-12 bg-white/10 mx-auto rounded-full group-hover:w-24 group-hover:bg-maple/40 transition-all duration-700" />
                                  <p className="text-muted font-bold text-sm uppercase tracking-widest opacity-60">{ranking.school}</p>
                               </div>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  );
                })}
                {rankings.length === 0 && (
                  <div className="py-60 text-center card-glass border-dashed rounded-[4rem]">
                     <Sparkles size={80} className="mx-auto text-white/5 mb-10 animate-pulse" />
                     <p className="font-ui text-xl font-bold uppercase tracking-[0.5em] text-muted/30 italic">Award citations are currently under embargo until the Closing Plenary.</p>
                  </div>
                )}
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
          <div className="max-w-7xl mx-auto px-6 py-32 space-y-48">
             <div className="text-center space-y-8">
                <p className="sec-label justify-center">Institutional Partners</p>
                <h2 className="text-7xl md:text-[10rem] font-display uppercase tracking-tighter leading-none text-white">Our <span className="text-maple">Patrons</span></h2>
                <p className="text-muted mt-6 text-2xl max-w-3xl mx-auto leading-relaxed font-medium opacity-60">Expressing profound gratitude to the organizations empowering the diplomatic journey of Chapter 02.</p>
             </div>

             <div className="space-y-32">
                {tiers.map(tier => {
                  const tierSponsors = sponsorsByTier[tier];
                  if (!tierSponsors || tierSponsors.length === 0) return null;

                  return (
                    <div key={tier} className="space-y-16">
                       <div className="flex items-center gap-10">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <h3 className={cn(
                             "text-4xl font-display uppercase tracking-[0.5em]",
                             tier === 'Platinum' ? "text-white" : tier === 'Gold' ? "text-maple" : "text-muted/60"
                          )}>{tier} Sponsors</h3>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                       </div>
                       <div className="flex flex-wrap justify-center gap-16">
                          {tierSponsors.map((sponsor, i) => (
                            <motion.a
                              initial={{ opacity: 0, scale: 0.9 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              whileHover={{ y: -10, scale: 1.05 }}
                              key={sponsor.id}
                              href={sponsor.website_url || '#'}
                              target="_blank"
                              className="group p-12 bg-white/2 border border-white/5 rounded-[4rem] hover:border-maple/40 transition-all duration-500 flex items-center justify-center w-80 h-56 shadow-2xl relative overflow-hidden"
                            >
                               <div className="absolute inset-0 bg-gradient-to-br from-maple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                               {sponsor.logo_url ? (
                                 <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-100" />
                               ) : (
                                 <span className="font-display text-3xl uppercase tracking-widest text-muted/30 group-hover:text-white transition-all duration-700">{sponsor.name}</span>
                               )}
                            </motion.a>
                          ))}
                       </div>
                    </div>
                  );
                })}
             </div>
             {sponsors.length === 0 && (
                <div className="py-60 text-center card-glass border-dashed rounded-[4rem]">
                   <p className="font-ui text-lg font-bold uppercase tracking-[0.5em] text-muted/20">Institutional partnership dossiers are available upon request.</p>
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
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
