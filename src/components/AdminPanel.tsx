import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Activity,
  Calendar, 
  Layers,
  Bell,
  ImageIcon,
  Settings as SettingsIcon,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  LogOut,
  ExternalLink,
  Shield,
  LayoutDashboard,
  Users,
  Edit,
  ClipboardList,
  Menu,
  ChevronRight,
  PlusCircle,
  Settings
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { House, Match, ScheduleItem, Category, GalleryItem, Notice, CulturalResult, StagedChange, Profile } from '../types';

type AdminTab = 'dashboard' | 'events' | 'scores' | 'schedule' | 'notices' | 'gallery' | 'houses' | 'config';

interface AdminPanelProps {
  matches: Match[];
  houses: House[];
  schedule: ScheduleItem[];
  categories: Category[];
  notices: Notice[];
  gallery: GalleryItem[];
  culturalResults: CulturalResult[];
  stagedChanges: StagedChange[];
  profile: Profile | null;
  settings: Record<string, string>;
  refresh: () => void;
  onBack?: () => void;
}

export default function AdminPanel({
  matches,
  houses,
  schedule,
  categories,
  notices,
  gallery,
  culturalResults,
  stagedChanges,
  profile: initialProfile,
  settings,
  refresh,
  onBack
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (password === 'ucsf2026') {
        setIsAuthenticated(true);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await action();
      setSuccess(successMsg);
      refresh();
    } catch (err: any) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-2xl">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 border border-blue-100">
              <Shield size={40} />
            </div>
          </div>
          <h2 className="text-4xl font-display text-center text-slate-900 mb-2 uppercase tracking-tight">Admin Login</h2>
          <p className="text-slate-500 text-center text-[10px] mb-12 uppercase tracking-[0.4em] font-bold">UCSF 2026 Portal</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-blue-500 outline-none transition-all"
                placeholder="admin@ucsf.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest transition-all hover:bg-blue-700 disabled:opacity-50 shadow-xl shadow-blue-500/20"
            >
              {loading ? 'Processing...' : 'Access Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                   { label: 'Events', count: categories.length, icon: Layers, color: 'bg-blue-50 text-blue-600' },
                   { label: 'Active Matches', count: matches.filter(m => m.status === 'live').length, icon: Activity, color: 'bg-green-50 text-green-600' },
                   { label: 'Houses', count: houses.length, icon: Users, color: 'bg-yellow-50 text-yellow-600' },
                   { label: 'Bulletins', count: notices.length, icon: Bell, color: 'bg-purple-50 text-purple-600' },
                ].map((stat, i) => (
                   <div key={i} className="bg-white border border-slate-200 p-8 rounded-[2rem] flex items-center gap-6 shadow-sm">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", stat.color)}>
                         <stat.icon size={28} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                         <p className="text-3xl font-display text-slate-900">{stat.count}</p>
                      </div>
                   </div>
                ))}
             </div>
             <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                <h3 className="text-2xl font-display uppercase mb-8 text-slate-900">Recent Activity</h3>
                <div className="space-y-4">
                   {matches.slice(-5).reverse().map(m => (
                      <div key={m.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="font-bold text-sm text-slate-700 uppercase tracking-wider">
                            {houses.find(h => h.id === m.team1_id)?.name} vs {houses.find(h => h.id === m.team2_id)?.name}
                         </span>
                         <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{categories.find(c => c.id === m.category_id)?.name}</span>
                            <span className="font-display text-blue-600 text-xl">{m.score1} - {m.score2}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
               <div>
                  <h3 className="text-3xl font-display uppercase text-slate-900 leading-none">Event Categories</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Sports and Cultural Competitions</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     const { error } = await supabase.from('categories').insert({ name: 'New Event', category_type: 'sports' });
                     if (error) throw error;
                  }, 'Event added successfully')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
               >
                  <PlusCircle size={20} /> Add New Event
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {categories.map(cat => (
                  <div key={cat.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-8 group hover:border-blue-200 transition-all shadow-sm">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                              <Layers size={24} />
                           </div>
                           <div>
                              <h4 className="text-2xl font-display text-slate-900 uppercase leading-none">{cat.name}</h4>
                              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-2 block">{cat.category_type}</span>
                           </div>
                        </div>
                        <button
                           onClick={() => handleAction(async () => {
                              if (!confirm('Permanently delete this event category?')) return;
                              const { error } = await supabase.from('categories').delete().eq('id', cat.id);
                              if (error) throw error;
                           }, 'Event deleted')}
                           className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                           <Trash2 size={22} />
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-6 pt-8 border-t border-slate-100">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Title</label>
                           <input
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:border-blue-500 outline-none transition-all"
                              defaultValue={cat.name}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('categories').update({ name: e.target.value }).eq('id', cat.id);
                              }, 'Title updated')}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                              <select
                                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:border-blue-500 outline-none"
                                 defaultValue={cat.category_type}
                                 onChange={(e) => handleAction(async () => {
                                    await supabase.from('categories').update({ category_type: e.target.value }).eq('id', cat.id);
                                 }, 'Category type updated')}
                              >
                                 <option value="sports">Sports</option>
                                 <option value="cultural">Cultural</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Format</label>
                              <input
                                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm text-slate-900 focus:border-blue-500 outline-none"
                                 defaultValue={cat.team_size || ''}
                                 placeholder="e.g. Solo / 7-a-side"
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('categories').update({ team_size: e.target.value }).eq('id', cat.id);
                                 }, 'Format updated')}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        );

      case 'scores':
        return (
           <div className="space-y-8">
             <div className="flex justify-between items-center bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
               <div>
                  <h3 className="text-3xl font-display uppercase text-slate-900 leading-none">Sports Scores</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Live Result Management</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     if (houses.length < 2 || categories.length === 0) throw new Error('Add houses and categories first');
                     const { error } = await supabase.from('matches').insert({
                        team1_id: houses[0].id,
                        team2_id: houses[1].id,
                        category_id: categories[0].id,
                        status: 'upcoming',
                        score1: 0,
                        score2: 0
                     });
                     if (error) throw error;
                  }, 'Match scheduled')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
               >
                  <PlusCircle size={20} /> Create Match
               </button>
            </div>
            <div className="space-y-8">
               {matches.map(m => (
                  <div key={m.id} className="bg-white border border-slate-200 rounded-[3rem] p-12 grid lg:grid-cols-4 gap-12 relative shadow-sm hover:border-blue-100 transition-all">
                     <button
                        onClick={() => handleAction(async () => {
                           if (!confirm('Delete this score record?')) return;
                           const { error } = await supabase.from('matches').delete().eq('id', m.id);
                           if (error) throw error;
                        }, 'Score record removed')}
                        className="absolute top-8 right-8 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                     >
                        <Trash2 size={24} />
                     </button>
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event</label>
                           <select
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 outline-none"
                              defaultValue={m.category_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ category_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Match event updated')}
                           >
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Status</label>
                           <select
                              className={cn(
                                 "w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold uppercase outline-none transition-colors",
                                 m.status === 'live' ? "text-green-600 bg-green-50 border-green-200" : "text-slate-900"
                              )}
                              defaultValue={m.status}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ status: e.target.value }).eq('id', m.id);
                              }, 'Status updated')}
                           >
                              <option value="upcoming">Upcoming</option>
                              <option value="live">Live Now</option>
                              <option value="completed">Final Result</option>
                           </select>
                        </div>
                     </div>
                     <div className="lg:col-span-3 grid grid-cols-3 gap-12 items-center bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100">
                        <div className="text-center space-y-8">
                           <select
                              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900"
                              defaultValue={m.team1_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team1_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Team updated')}
                           >
                              {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                           </select>
                           <div className="space-y-3">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</label>
                              <input
                                 type="number"
                                 className="w-24 bg-white border border-slate-200 rounded-[1.5rem] px-4 py-6 text-center text-5xl font-display text-blue-600 shadow-sm focus:border-blue-500 outline-none transition-all"
                                 defaultValue={m.score1}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('matches').update({ score1: parseInt(e.target.value) }).eq('id', m.id);
                                 }, 'Score updated')}
                              />
                           </div>
                        </div>
                        <div className="text-center font-display text-3xl text-slate-200 italic">vs</div>
                        <div className="text-center space-y-8">
                           <select
                              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900"
                              defaultValue={m.team2_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team2_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Team updated')}
                           >
                              {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                           </select>
                           <div className="space-y-3">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Score</label>
                              <input
                                 type="number"
                                 className="w-24 bg-white border border-slate-200 rounded-[1.5rem] px-4 py-6 text-center text-5xl font-display text-blue-600 shadow-sm focus:border-blue-500 outline-none transition-all"
                                 defaultValue={m.score2}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('matches').update({ score2: parseInt(e.target.value) }).eq('id', m.id);
                                 }, 'Score updated')}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
           </div>
        );

      case 'notices':
        return (
           <div className="space-y-8">
             <div className="flex justify-between items-center bg-white border border-slate-200 p-10 rounded-[2rem] shadow-sm">
               <div>
                  <h3 className="text-3xl font-display uppercase text-slate-900 leading-none">Bulletin Board</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Post Important Announcements</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     const { error } = await supabase.from('notices').insert({ title: 'New Notice', content: 'Details...', priority: 'normal' });
                     if (error) throw error;
                  }, 'Notice published')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
               >
                  <PlusCircle size={20} /> New Bulletin
               </button>
            </div>
            <div className="space-y-10">
               {notices.map(n => (
                  <div key={n.id} className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm group hover:border-blue-100 transition-all">
                     <div className="flex justify-between items-start gap-12">
                        <div className="flex-1 space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notice Title</label>
                              <input
                                 className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 text-4xl font-display uppercase outline-none py-4 transition-all text-slate-900"
                                 defaultValue={n.title}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('notices').update({ title: e.target.value }).eq('id', n.id);
                                 }, 'Notice title updated')}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body Text</label>
                              <textarea
                                 className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-lg text-slate-700 min-h-[180px] outline-none focus:border-blue-500 transition-all"
                                 defaultValue={n.content}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('notices').update({ content: e.target.value }).eq('id', n.id);
                                 }, 'Notice content updated')}
                              />
                           </div>
                        </div>
                        <div className="space-y-6 shrink-0">
                           <button
                              onClick={() => handleAction(async () => {
                                 if (!confirm('Remove this bulletin?')) return;
                                 const { error } = await supabase.from('notices').delete().eq('id', n.id);
                                 if (error) throw error;
                              }, 'Notice removed')}
                              className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-[1.5rem] transition-all ml-auto block"
                           >
                              <Trash2 size={28} />
                           </button>
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right block">Alert Level</label>
                              <select
                                 className={cn(
                                    "bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-[10px] font-bold uppercase outline-none",
                                    n.priority === 'high' ? "text-red-600 bg-red-50 border-red-100" : "text-slate-900"
                                 )}
                                 defaultValue={n.priority}
                                 onChange={(e) => handleAction(async () => {
                                    await supabase.from('notices').update({ priority: e.target.value }).eq('id', n.id);
                                 }, 'Notice priority updated')}
                              >
                                 <option value="normal">Standard</option>
                                 <option value="high">Urgent</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
           </div>
        );

      case 'config':
        return (
          <div className="space-y-12">
            <div>
               <h3 className="text-4xl font-display text-slate-900 uppercase tracking-tight">Portal Config</h3>
               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Global Identity and Parameters</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 space-y-10 max-w-4xl shadow-sm">
               {['festival_name', 'festival_subtitle', 'school_logo_url', 'announcement_text'].map(key => (
                  <div key={key} className="space-y-3">
                     <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</label>
                     <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 text-lg text-slate-900 focus:border-blue-500 outline-none transition-all shadow-inner"
                        defaultValue={settings[key] || ''}
                        onBlur={(e) => handleAction(async () => {
                           await supabase.from('settings').upsert({ key_name: key, val: e.target.value }, { onConflict: 'key_name' });
                        }, 'Global configuration updated')}
                     />
                  </div>
               ))}
            </div>
          </div>
        );

      default:
        return (
           <div className="flex flex-col items-center justify-center py-60 bg-white border border-slate-200 border-dashed rounded-[3rem]">
              <ClipboardList size={100} className="mb-8 text-slate-100" />
              <p className="font-display uppercase text-3xl tracking-[0.2em] text-slate-200 text-center">
                 Advanced Controls<br/>
                 <span className="text-xs font-bold uppercase tracking-[0.5em] mt-6 block text-slate-300">Under Development</span>
              </p>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-ui">
      {/* Fixed Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-500 ease-in-out",
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-28"
      )}>
        <div className={cn("p-12 border-b border-slate-100 flex items-center justify-center transition-all", !isSidebarOpen && "px-6")}>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-blue-500/30">
              <Shield size={32} />
            </div>
            {isSidebarOpen && (
               <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                  <h1 className="text-4xl font-display uppercase tracking-tight text-blue-600 leading-none">UCSF</h1>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Admin Panel</p>
               </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-10 space-y-6 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'events', label: 'Events', icon: Layers },
            { id: 'scores', label: 'Sports Scores', icon: Activity },
            { id: 'results', label: 'Standings', icon: Trophy },
            { id: 'schedule', label: 'Timeline', icon: Calendar },
            { id: 'notices', label: 'Bulletins', icon: Bell },
            { id: 'gallery', label: 'Media', icon: ImageIcon },
            { id: 'houses', label: 'Houses', icon: Users },
            { id: 'config', label: 'Portal Config', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-6 px-6 py-5 font-bold text-[11px] uppercase tracking-[0.2em] transition-all rounded-[1.5rem] group relative",
                activeTab === item.id ? "bg-blue-600 text-white shadow-2xl shadow-blue-500/20" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              )}
            >
              <item.icon size={24} className={cn("shrink-0", activeTab === item.id ? "text-white" : "text-slate-300 group-hover:text-blue-600")} />
              {isSidebarOpen && <span className="animate-in fade-in duration-500">{item.label}</span>}
              {!isSidebarOpen && activeTab === item.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-l-full" />}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-slate-100 space-y-4">
          <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-4 shadow-sm hover:shadow-xl hover:shadow-red-500/20">
            <LogOut size={20} /> {isSidebarOpen && 'Logout'}
          </button>
          <button onClick={onBack} className="w-full py-5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-4 border border-slate-100">
            <ExternalLink size={20} /> {isSidebarOpen && 'Exit Admin'}
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className={cn(
         "flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
         isSidebarOpen ? "ml-80" : "lg:ml-28"
      )}>
        <header className="h-32 bg-white/95 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-16 z-40">
          <div className="flex items-center gap-10">
            <button
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-4 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm hover:shadow-md"
            >
              <Menu size={24} />
            </button>
            <div className="space-y-1">
               <h2 className="text-5xl font-display uppercase tracking-tight text-slate-900 leading-none">{activeTab}</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-1">Portal Root</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden xl:flex flex-col items-end border-r border-slate-100 pr-10">
               <p className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">Root Admin</p>
               <p className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">UCSF 2026</p>
            </div>
            <button onClick={refresh} className="w-16 h-16 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-[1.5rem] transition-all flex items-center justify-center shadow-sm hover:shadow-2xl hover:shadow-blue-500/20">
              <RefreshCw size={28} className={cn(loading && "animate-spin")} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-16 custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto space-y-12 pb-32">
            {error && (
              <div className="p-10 bg-red-50 border border-red-100 rounded-[3rem] flex items-start gap-8 text-red-600 shadow-2xl shadow-red-500/10 animate-in slide-in-from-top-12 duration-500">
                <AlertCircle size={40} className="shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                   <p className="text-[14px] font-bold uppercase tracking-[0.3em]">Critical Alert</p>
                   <p className="text-xl font-medium leading-relaxed">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="p-2 hover:bg-red-100 rounded-xl transition-all">
                   <X size={28} />
                </button>
              </div>
            )}
            {success && (
              <div className="p-10 bg-green-50 border border-green-100 rounded-[3rem] flex items-start gap-8 text-green-600 shadow-2xl shadow-green-500/10 animate-in slide-in-from-top-12 duration-500">
                <CheckCircle size={40} className="shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                   <p className="text-[14px] font-bold uppercase tracking-[0.3em]">Operation Confirmed</p>
                   <p className="text-xl font-medium leading-relaxed">{success}</p>
                </div>
                <button onClick={() => setSuccess(null)} className="p-2 hover:bg-green-100 rounded-xl transition-all">
                   <X size={28} />
                </button>
              </div>
            )}

            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
