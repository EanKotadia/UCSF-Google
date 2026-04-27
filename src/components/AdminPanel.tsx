import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Activity, Calendar, Bell,
  Settings as SettingsIcon, LogOut, RefreshCw,
  Plus, Trash2, Save, X, CheckCircle,
  AlertCircle, LayoutDashboard, Layers, Users,
  ImageIcon, ExternalLink, Menu, Shield,
  Search, Filter, ArrowUpRight, ClipboardList
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminData } from '../hooks/useAdminData';
import { cn } from '../lib/utils';
import { Match, Category, ScheduleItem, Notice, GalleryItem, House } from '../types';

type AdminTab = 'dashboard' | 'events' | 'scores' | 'results' | 'schedule' | 'notices' | 'gallery' | 'config' | 'houses';

interface AdminPanelProps {
  onBack: () => void;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const {
    houses, matches, schedule, settings,
    categories, gallery, notices,
    loading, error: fetchError, refresh
  } = useAdminData();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('ucsf_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ucsf2026') {
      setIsAuthenticated(true);
      localStorage.setItem('ucsf_admin_auth', 'true');
      setError(null);
    } else {
      setError('Invalid administrative credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ucsf_admin_auth');
  };

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    try {
      setError(null);
      await action();
      setSuccess(successMsg);
      refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Operation failed. Verify database connectivity.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg card-glass p-16 space-y-12 shadow-2xl border-accent/20"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-8 border border-accent/20 shadow-xl shadow-accent/5">
              <Shield size={40} />
            </div>
            <h1 className="nav-logo text-5xl">UCSF ADMIN</h1>
            <p className="text-muted text-[10px] font-bold uppercase tracking-[0.5em]">Restricted Access Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
               <label className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] ml-1">Access Key</label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="form-input py-5 text-center tracking-[0.5em] text-xl"
                 placeholder="••••••••"
                 autoFocus
               />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-5 text-base">
               Establish Connection <ArrowUpRight size={20} />
            </button>
            {error && (
               <p className="text-danger text-center text-xs font-bold uppercase tracking-widest animate-pulse">{error}</p>
            )}
          </form>
          <button onClick={onBack} className="w-full text-subtle hover:text-muted text-[10px] font-bold uppercase tracking-[0.3em] transition-colors">
             Return to Public Portal
          </button>
        </motion.div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                   { label: 'Active Events', val: matches.filter(m => m.status === 'live').length, icon: Activity, color: 'text-danger' },
                   { label: 'Upcoming', val: matches.filter(m => m.status === 'upcoming').length, icon: Calendar, color: 'text-accent' },
                   { label: 'Completed', val: matches.filter(m => m.status === 'completed').length, icon: Trophy, color: 'text-success' }
                ].map((s, i) => (
                   <div key={i} className="card-glass p-12 group hover:border-accent/30 transition-all shadow-sm">
                      <s.icon size={32} className={cn(s.color, "mb-6 opacity-80 group-hover:opacity-100 transition-all")} />
                      <p className="text-5xl font-display text-text mb-2">{s.val}</p>
                      <p className="text-[11px] font-bold text-muted uppercase tracking-[0.3em]">{s.label}</p>
                   </div>
                ))}
             </div>

             <div className="card-glass p-12 space-y-10">
                <div className="flex items-center justify-between border-b border-border pb-8">
                   <h3 className="text-3xl font-display text-text uppercase tracking-tight">System Status</h3>
                   <span className="badge badge-upcoming">Operational</span>
                </div>
                <div className="space-y-4">
                   <p className="text-subtle text-sm italic">Database connected to project lyoiiwldzzvnykbrjfbh.</p>
                </div>
             </div>
          </div>
        );

      case 'houses':
        return (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-4xl font-display text-text uppercase tracking-tight">House Management</h3>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Identity and Global Standing</p>
               </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
               {houses.map(house => (
                  <div key={house.id} className="card-glass p-10 space-y-10 group relative">
                     <div className="absolute top-0 right-0 p-8">
                        <div className="w-4 h-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)]" style={{ backgroundColor: house.color }} />
                     </div>

                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest block">Mascot Image URL</label>
                              <input
                                 className="form-input text-xs"
                                 defaultValue={house.logo_url || ''}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('houses').update({ logo_url: e.target.value }).eq('id', house.id);
                                 }, `${house.name} mascot updated`)}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest block">Display Name</label>
                              <input
                                 className="form-input font-display text-2xl uppercase"
                                 defaultValue={house.name}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('houses').update({ name: e.target.value }).eq('id', house.id);
                                 }, 'House name updated')}
                              />
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-accent uppercase tracking-widest block">Sports Pts</label>
                                 <input
                                    type="number"
                                    className="form-input text-xl font-display"
                                    defaultValue={house.sports_points || 0}
                                    onBlur={(e) => handleAction(async () => {
                                       const val = parseInt(e.target.value);
                                       const total = val + (house.cultural_points || 0);
                                       await supabase.from('houses').update({ sports_points: val, points: total }).eq('id', house.id);
                                    }, 'Sports points updated')}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[9px] font-bold text-accent uppercase tracking-widest block">Cultural Pts</label>
                                 <input
                                    type="number"
                                    className="form-input text-xl font-display"
                                    defaultValue={house.cultural_points || 0}
                                    onBlur={(e) => handleAction(async () => {
                                       const val = parseInt(e.target.value);
                                       const total = val + (house.sports_points || 0);
                                       await supabase.from('houses').update({ cultural_points: val, points: total }).eq('id', house.id);
                                    }, 'Cultural points updated')}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-bold text-muted uppercase tracking-widest block">Motto / War Cry</label>
                              <input
                                 className="form-input italic text-sm"
                                 defaultValue={house.motto || ''}
                                 onBlur={(e) => handleAction(async () => {
                                    await supabase.from('houses').update({ motto: e.target.value }).eq('id', house.id);
                                 }, 'Motto updated')}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-4xl font-display text-text uppercase tracking-tight">Match Control</h3>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Live Scoring and Status</p>
               </div>
               <button
                  onClick={() => handleAction(async () => {
                     await supabase.from('matches').insert({ category_id: 'new-event', team1_id: 'Team A', team2_id: 'Team B', status: 'upcoming' });
                  }, 'New event entry created')}
                  className="btn-primary"
               >
                  <Plus size={20} /> Create Match
               </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
               {matches.map(match => (
                  <div key={match.id} className="card-glass p-10 flex flex-col xl:flex-row xl:items-center gap-12 group transition-all">
                     <div className="xl:w-48 space-y-4">
                        <select
                           className="form-select text-[10px] font-bold uppercase"
                           defaultValue={match.status}
                           onChange={(e) => handleAction(async () => {
                              await supabase.from('matches').update({ status: e.target.value }).eq('id', match.id);
                           }, 'Status synchronized')}
                        >
                           <option value="upcoming">Upcoming</option>
                           <option value="live">Live & Ongoing</option>
                           <option value="completed">Completed</option>
                        </select>
                        <input
                           className="form-input text-xs"
                           defaultValue={match.category_id}
                           onBlur={(e) => handleAction(async () => {
                              await supabase.from('matches').update({ category_id: e.target.value }).eq('id', match.id);
                           }, 'Category updated')}
                        />
                     </div>

                     <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white/5 rounded-3xl p-8">
                        <div className="text-center space-y-4">
                           <input
                              className="form-input text-center font-display text-xl uppercase"
                              defaultValue={match.team1_id}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team1_id: e.target.value }).eq('id', match.id);
                              }, 'Team 1 updated')}
                           />
                           <input
                              type="number"
                              className="form-input text-center text-4xl font-display text-accent"
                              defaultValue={match.score1 ?? 0}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ score1: parseInt(e.target.value) }).eq('id', match.id);
                              }, 'Score synchronized')}
                           />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <span className="text-muted font-display text-2xl opacity-20">VS</span>
                           <div className="h-px w-full bg-white/5" />
                        </div>
                        <div className="text-center space-y-4">
                           <input
                              className="form-input text-center font-display text-xl uppercase"
                              defaultValue={match.team2_id}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ team2_id: e.target.value }).eq('id', match.id);
                              }, 'Team 2 updated')}
                           />
                           <input
                              type="number"
                              className="form-input text-center text-4xl font-display text-accent"
                              defaultValue={match.score2 ?? 0}
                              onBlur={(e) => handleAction(async () => {
                                 await supabase.from('matches').update({ score2: parseInt(e.target.value) }).eq('id', match.id);
                              }, 'Score synchronized')}
                           />
                        </div>
                     </div>

                     <div className="xl:w-64 space-y-4">
                        <input
                           className="form-input text-xs"
                           placeholder="Venue Location"
                           defaultValue={match.venue || ''}
                           onBlur={(e) => handleAction(async () => {
                              await supabase.from('matches').update({ venue: e.target.value }).eq('id', match.id);
                           }, 'Venue updated')}
                        />
                        <button
                           onClick={() => handleAction(async () => {
                              await supabase.from('matches').delete().eq('id', match.id);
                           }, 'Event record purged')}
                           className="btn-danger w-full justify-center py-3 text-[10px]"
                        >
                           <Trash2 size={16} /> Purge Entry
                        </button>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="card-glass p-12 space-y-10 shadow-sm">
                  <div className="flex items-center gap-4 border-b border-border pb-6">
                     <Trophy size={24} className="text-accent" />
                     <h4 className="text-2xl font-display uppercase tracking-tight">Final Ceremony Control</h4>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">DECLARE GLOBAL WINNER</label>
                        <select
                           className="form-select py-5 text-lg font-display uppercase"
                           value={settings['winner_house_id'] || ''}
                           onChange={(e) => handleAction(async () => {
                              const val = e.target.value === '' ? null : e.target.value;
                              await supabase.from('settings').upsert({ key_name: 'winner_house_id', val: val }, { onConflict: 'key_name' });
                           }, 'Winner status updated')}
                        >
                           <option value="">No Winner Declared</option>
                           {houses.map(h => (
                              <option key={h.id} value={h.id}>HOUSE {h.name.toUpperCase()}</option>
                           ))}
                        </select>
                        <p className="text-subtle text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                           Setting a winner will trigger the Surprise Celebration for all portal users.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="card-glass p-12 space-y-10 shadow-sm">
                  <div className="flex items-center gap-4 border-b border-border pb-6">
                     <SettingsIcon size={24} className="text-accent" />
                     <h4 className="text-2xl font-display uppercase tracking-tight">Branding & Meta</h4>
                  </div>
                  <div className="space-y-10">
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
            {(error || fetchError) && (
              <div className="p-10 bg-danger/10 border border-danger/30 rounded-[3rem] flex items-start gap-8 text-danger shadow-2xl animate-in slide-in-from-top-12 duration-500">
                <AlertCircle size={40} className="shrink-0 mt-1" />
                <div className="space-y-2 flex-1">
                   <p className="text-[14px] font-bold uppercase tracking-[0.3em]">Critical Alert</p>
                   <p className="text-xl font-medium leading-relaxed">{error || fetchError}</p>
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
