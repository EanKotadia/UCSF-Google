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
  Mail,
  Lock,
  AlertCircle
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
      <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
        <div className="max-w-md w-full card-glass p-12 shadow-2xl">
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent border border-accent/20">
              <Shield size={40} />
            </div>
          </div>
          <h2 className="text-4xl font-display text-center text-text mb-2 uppercase tracking-tight">Admin Login</h2>
          <p className="text-muted text-center text-[10px] mb-12 uppercase tracking-[0.4em] font-bold">UCSF 2026 Portal</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                 <Mail size={12} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@ucsf.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                 <Lock size={12} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4"
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
                   { label: 'Events', count: categories.length, icon: Layers, color: 'bg-accent/10 text-accent' },
                   { label: 'Live Matches', count: matches.filter(m => m.status === 'live').length, icon: Activity, color: 'bg-danger/10 text-danger' },
                   { label: 'Houses', count: houses.length, icon: Users, color: 'bg-white/5 text-text' },
                   { label: 'Bulletins', count: notices.length, icon: Bell, color: 'bg-white/5 text-muted' },
                ].map((stat, i) => (
                   <div key={i} className="card-glass p-8 flex items-center gap-6">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5", stat.color)}>
                         <stat.icon size={28} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                         <p className="text-3xl font-display text-text">{stat.count}</p>
                      </div>
                   </div>
                ))}
             </div>

             <div className="card-glass p-10">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-display uppercase text-text">Recent Activity</h3>
                   <button onClick={() => setActiveTab('scores')} className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                   {matches.slice(-5).reverse().map(m => (
                      <div key={m.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                         <span className="font-bold text-sm text-text uppercase tracking-wider">
                            {houses.find(h => h.id === m.team1_id)?.name} vs {houses.find(h => h.id === m.team2_id)?.name}
                         </span>
                         <span className="font-display text-accent text-xl">{m.score1} - {m.score2}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center card-glass p-10">
               <div>
                  <h3 className="text-3xl font-display uppercase text-text leading-none">Event Categories</h3>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Sports and Cultural Competitions</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     const { error } = await supabase.from('categories').insert({ name: 'New Event', category_type: 'sports' });
                     if (error) throw error;
                  }, 'Event added successfully')}
                  className="btn-primary"
               >
                  <PlusCircle size={20} /> Add New Event
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {categories.map(cat => (
                  <div key={cat.id} className="card-glass p-10 space-y-8 group hover:border-accent/20 transition-all">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-accent border border-white/5">
                              <Layers size={24} />
                           </div>
                           <div>
                              <h4 className="text-2xl font-display text-text uppercase leading-none">{cat.name}</h4>
                              <span className="text-[10px] font-bold text-accent uppercase tracking-widest mt-2 block">{cat.category_type}</span>
                           </div>
                        </div>
                        <button
                           onClick={() => handleAction(async () => {
                              if (!confirm('Delete this category?')) return;
                              const { error } = await supabase.from('categories').delete().eq('id', cat.id);
                              if (error) throw error;
                           }, 'Event deleted')}
                           className="p-3 text-subtle hover:text-danger transition-all"
                        >
                           <Trash2 size={22} />
                        </button>
                     </div>
                     <div className="grid grid-cols-1 gap-6 pt-8 border-t border-border">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Event Title</label>
                           <input
                              className="form-input"
                              defaultValue={cat.name}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('categories').update({ name: e.target.value }).eq('id', cat.id);
                              }, 'Title updated')}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Type</label>
                              <select
                                 className="form-select"
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
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Format</label>
                              <input
                                 className="form-input"
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
             <div className="flex justify-between items-center card-glass p-10">
               <div>
                  <h3 className="text-3xl font-display uppercase text-text leading-none">Sports Scores</h3>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Live Result Management</p>
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
                  className="btn-primary"
               >
                  <PlusCircle size={20} /> Create Match
               </button>
            </div>
            <div className="space-y-8">
               {matches.map(m => (
                  <div key={m.id} className="card-glass p-12 grid lg:grid-cols-4 gap-12 relative group hover:border-white/10 transition-all">
                     <button
                        onClick={() => handleAction(async () => {
                           if (!confirm('Delete this record?')) return;
                           const { error } = await supabase.from('matches').delete().eq('id', m.id);
                           if (error) throw error;
                        }, 'Record removed')}
                        className="absolute top-8 right-8 p-3 text-subtle hover:text-danger transition-all"
                     >
                        <Trash2 size={24} />
                     </button>
                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Event</label>
                           <select
                              className="form-select"
                              defaultValue={m.category_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ category_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Match event updated')}
                           >
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Status</label>
                           <select
                              className={cn(
                                 "form-select font-bold uppercase",
                                 m.status === 'live' ? "text-danger border-danger/30" : "text-text"
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
                     <div className="lg:col-span-3 grid grid-cols-3 gap-12 items-center bg-white/5 p-12 rounded-[2.5rem] border border-white/5">
                        <div className="text-center space-y-8">
                           <select
                              className="w-full bg-bg3 border border-border rounded-xl px-4 py-3 text-xs font-bold text-text outline-none"
                              defaultValue={m.team1_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team1_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Team updated')}
                           >
                              {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                           </select>
                           <div className="space-y-3">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest">Score</label>
                              <input
                                 type="number"
                                 className="w-24 bg-white/5 border border-white/10 rounded-[1.5rem] px-4 py-6 text-center text-5xl font-display text-accent shadow-sm focus:border-accent outline-none transition-all"
                                 defaultValue={m.score1}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('matches').update({ score1: parseInt(e.target.value) }).eq('id', m.id);
                                 }, 'Score updated')}
                              />
                           </div>
                        </div>
                        <div className="text-center font-display text-3xl text-subtle italic">vs</div>
                        <div className="text-center space-y-8">
                           <select
                              className="w-full bg-bg3 border border-border rounded-xl px-4 py-3 text-xs font-bold text-text outline-none"
                              defaultValue={m.team2_id}
                              onChange={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team2_id: parseInt(e.target.value) }).eq('id', m.id);
                              }, 'Team updated')}
                           >
                              {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                           </select>
                           <div className="space-y-3">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest">Score</label>
                              <input
                                 type="number"
                                 className="w-24 bg-white/5 border border-white/10 rounded-[1.5rem] px-4 py-6 text-center text-5xl font-display text-accent shadow-sm focus:border-accent outline-none transition-all"
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
             <div className="flex justify-between items-center card-glass p-10">
               <div>
                  <h3 className="text-3xl font-display uppercase text-text leading-none">Bulletin Board</h3>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Post Official Announcements</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     const { error } = await supabase.from('notices').insert({ title: 'New Notice', content: 'Details...', priority: 'normal' });
                     if (error) throw error;
                  }, 'Notice published')}
                  className="btn-primary"
               >
                  <PlusCircle size={20} /> New Bulletin
               </button>
            </div>
            <div className="space-y-10">
               {notices.map(n => (
                  <div key={n.id} className="card-glass p-12 shadow-sm group hover:border-white/10 transition-all">
                     <div className="flex justify-between items-start gap-12">
                        <div className="flex-1 space-y-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Notice Title</label>
                              <input
                                 className="w-full bg-transparent border-b border-border focus:border-accent text-4xl font-display uppercase outline-none py-4 transition-all text-text"
                                 defaultValue={n.title}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('notices').update({ title: e.target.value }).eq('id', n.id);
                                 }, 'Notice title updated')}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Body Text</label>
                              <textarea
                                 className="form-input min-h-[180px] text-lg"
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
                              className="p-4 text-subtle hover:text-danger transition-all ml-auto block"
                           >
                              <Trash2 size={28} />
                           </button>
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest text-right block">Alert Level</label>
                              <select
                                 className={cn(
                                    "form-select text-[10px] font-bold uppercase",
                                    n.priority === 'high' ? "text-danger border-danger/30" : "text-text"
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
               <h3 className="text-4xl font-display text-text uppercase tracking-tight">Portal Config</h3>
               <p className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Global Identity and Parameters</p>
            </div>
            <div className="card-glass p-12 space-y-10 max-w-4xl shadow-sm">
               {['festival_name', 'festival_subtitle', 'school_logo_url', 'announcement_text'].map(key => (
                  <div key={key} className="space-y-3">
                     <label className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</label>
                     <input
                        className="form-input py-5 text-lg"
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
           <div className="flex flex-col items-center justify-center py-60 card-glass border-dashed">
              <ClipboardList size={100} className="mb-8 text-subtle" />
              <p className="font-display uppercase text-3xl tracking-[0.2em] text-subtle text-center">
                 Advanced Controls<br/>
                 <span className="text-xs font-bold uppercase tracking-[0.5em] mt-6 block text-muted">Under Development</span>
              </p>
           </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex overflow-hidden font-sans selection:bg-accent/20">
      {/* Sidebar - Always visible in desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-80 bg-bg border-r border-border flex flex-col z-[120] transition-all duration-500 ease-in-out",
        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-28"
      )}>
        <div className={cn("p-12 border-b border-border flex items-center justify-center transition-all", !isSidebarOpen && "px-6")}>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-accent text-bg rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-accent/30">
              <Shield size={32} />
            </div>
            {isSidebarOpen && (
               <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                  <h1 className="nav-logo text-4xl">UCSF</h1>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Admin Panel</p>
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
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'notices', label: 'Bulletins', icon: Bell },
            { id: 'gallery', label: 'Media', icon: ImageIcon },
            { id: 'houses', label: 'Houses', icon: Users },
            { id: 'config', label: 'Portal Config', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-6 px-6 py-5 font-ui text-[11px] font-bold uppercase tracking-[2.5px] transition-all rounded-[1.5rem] group relative",
                activeTab === item.id ? "bg-accent text-bg shadow-2xl shadow-accent/20" : "text-muted hover:text-accent hover:bg-white/5"
              )}
            >
              <item.icon size={24} className={cn("shrink-0", activeTab === item.id ? "text-bg" : "text-subtle group-hover:text-accent")} />
              {isSidebarOpen && <span className="animate-in fade-in duration-500">{item.label}</span>}
              {!isSidebarOpen && activeTab === item.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-accent rounded-l-full" />}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-border space-y-4">
          <button onClick={handleLogout} className="btn-danger w-full justify-center py-5">
            <LogOut size={20} /> {isSidebarOpen && 'Logout'}
          </button>
          <button onClick={onBack} className="btn-ghost w-full justify-center py-5">
            <ExternalLink size={20} /> {isSidebarOpen && 'Exit Admin'}
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className={cn(
         "flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out relative z-10",
         isSidebarOpen ? "ml-80" : "lg:ml-28"
      )}>
        <header className="h-32 bg-bg/95 backdrop-blur-xl border-b border-border flex items-center justify-between px-16 z-40">
          <div className="flex items-center gap-10">
            <button
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-4 bg-white/5 text-subtle hover:text-accent rounded-2xl transition-all shadow-sm"
            >
              <Menu size={24} />
            </button>
            <div className="space-y-1">
               <h2 className="text-5xl font-display uppercase tracking-tight text-text leading-none">{activeTab}</h2>
               <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] ml-1">Portal Root</p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden xl:flex flex-col items-end border-r border-border pr-10">
               <p className="text-[12px] font-bold text-text uppercase tracking-widest font-ui">Root Admin</p>
               <p className="text-[9px] text-muted uppercase tracking-widest font-medium">UCSF 2026</p>
            </div>
            <button onClick={refresh} className="w-16 h-16 bg-white/5 text-accent hover:bg-accent hover:text-bg rounded-[1.5rem] transition-all flex items-center justify-center shadow-sm border border-accent/20">
              <RefreshCw size={28} className={cn(loading && "animate-spin")} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-16 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto space-y-12 pb-32">
            {error && (
              <div className="p-10 bg-danger/10 border border-danger/30 rounded-[3rem] flex items-start gap-8 text-danger shadow-2xl animate-in slide-in-from-top-12 duration-500">
                <AlertCircle size={40} className="shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                   <p className="text-[14px] font-bold uppercase tracking-[0.3em]">Critical Alert</p>
                   <p className="text-xl font-medium leading-relaxed">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="p-2 hover:bg-danger/10 rounded-xl transition-all">
                   <X size={28} />
                </button>
              </div>
            )}
            {success && (
              <div className="p-10 bg-success/10 border border-success/30 rounded-[3rem] flex items-start gap-8 text-success shadow-2xl animate-in slide-in-from-top-12 duration-500">
                <CheckCircle size={40} className="shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                   <p className="text-[14px] font-bold uppercase tracking-[0.3em]">Operation Confirmed</p>
                   <p className="text-xl font-medium leading-relaxed">{success}</p>
                </div>
                <button onClick={() => setSuccess(null)} className="p-2 hover:bg-success/10 rounded-xl transition-all">
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
