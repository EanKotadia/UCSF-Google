import AdminPanel from './components/AdminPanel';
import SupabaseConfig from './components/SupabaseConfig';
import { configureSupabase, supabase } from './lib/supabase';
import React, { useState } from 'react';
import Layout from './components/Layout';
import EventsSection from './components/EventsSection';
import { useHarmoniaMUNData } from './hooks/useHarmoniaMUNData';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Calendar, Shield, Loader2, AlertCircle, ChevronRight, Play, Image as ImageIcon, Video, ExternalLink, Bell, Info, FileText, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

export default function App() {
  if (!supabase) return <SupabaseConfig onConfigured={configureSupabase} />;

  const [activeTab, setActiveTab] = useState('home');
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);
  const { committees, members, rankings, schedule, settings, notices, stagedChanges, profile, houses, loading, error, refresh } = useHarmoniaMUNData();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#BC8A2C]/20 border-t-[#BC8A2C] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="text-[#BC8A2C]" size={24} />
          </div>
        </div>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-[#BC8A2C] animate-pulse">Loading Harmonia MUN Data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b1a] p-6 text-center">
        <div className="w-20 h-20 bg-[#BC8A2C]/10 text-[#BC8A2C] rounded-3xl flex items-center justify-center mb-6 border border-[#BC8A2C]/20">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-display text-white mb-4">Connection Error</h2>
        <p className="text-white/40 max-w-md mb-8 font-medium">{error}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => window.location.reload()} className="btn-primary">Retry Connection</button>
          <button onClick={() => refresh()} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-ui text-xs font-bold uppercase tracking-widest text-white transition-all">Refresh Data</button>
        </div>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'Harmonia MUN 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Harmonia Model United Nations';
  const announcementText = settings['announcement_text'];
  const footerText = settings['footer_text'];
  const schoolLogoUrl = settings['school_logo_url'];

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return (
          <AdminPanel
            committees={committees}
            members={members}
            rankings={rankings}
            schedule={schedule}
            notices={notices}
            stagedChanges={stagedChanges}
            profile={profile}
            settings={settings}
            houses={houses}
            refresh={refresh}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'events':
        return <EventsSection categories={committees} matches={[]} setActiveTab={setActiveTab} />;
      case 'home':
        return (
          <div className="space-y-0">
             <section className="relative py-32 md:py-48 overflow-hidden border-b border-white/5">
              <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#BC8A2C]/10 blur-[120px] rounded-full" />
              <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="mb-8 flex justify-center">
                  <img src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"} alt="School Logo" className="h-20 md:h-24 object-contain opacity-90" referrerPolicy="no-referrer" />
                </div>
                <h1 className="hero-title mb-6">{festivalName}</h1>
                <p className="hero-sub mb-12">{festivalSubtitle}</p>
                <button onClick={() => setActiveTab('events')} className="btn-primary group flex items-center gap-2 mx-auto">
                  Explore Committees <ChevronRight size={18} />
                </button>
              </div>
            </section>
          </div>
        );
      case 'notices':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <h2 className="text-4xl sm:text-6xl font-display mb-12">Official Notices</h2>
            <div className="grid grid-cols-1 gap-8">
              {notices.map((notice) => (
                <div key={notice.id} className="card-glass p-8" onClick={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}>
                   <h3 className="text-2xl font-display mb-4">{notice.title}</h3>
                   <p className="text-white/60">{notice.content}</p>
                </div>
              ))}
            </div>
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
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
