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
  ChevronRight,
  Search,
  Mail,
  Lock,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { House, Match, ScheduleItem, Category, GalleryItem, Notice, CulturalResult, StagedChange, Profile } from '../types';

type AdminTab = 'results' | 'matches' | 'schedule' | 'categories' | 'notices' | 'gallery' | 'leaderboards' | 'settings' | 'approvals';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('results');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setIsAuthenticated(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
      if (session) setIsAuthenticated(true);
      else setIsAuthenticated(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (password === 'harmonia2026') {
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
    setSession(null);
  };

  const handleAction = async (action: () => Promise<any>, context: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await action();
      setSuccess(`${context} successful`);
      refresh();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error(`Error during ${context}:`, err);
      setError(`System Error: ${err.message || `Failed to ${context.toLowerCase()}`}`);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 font-ui">
        <div className="w-full max-w-md bg-bg2 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-transparent" />
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-display text-white uppercase tracking-wider">Harmonia MUN Admin</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Union of Culture & Sports Fest 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  placeholder="Admin Email"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="password"
                  placeholder="Access Key"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gold hover:bg-gold/90 text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-gold/20"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Authorize Access'}
            </button>
          </form>
          {error && <p className="mt-6 text-center text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'results':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display text-white uppercase">Match Score Entry</h3>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">Live updates for active sports</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.filter(m => m.status !== 'completed').map(match => (
                <div key={match.id} className="bg-bg2 border border-white/5 rounded-3xl p-8 space-y-6 group hover:border-gold/30 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {categories.find(c => c.id === match.category_id)?.name} • Match #{match.match_no}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest",
                      match.status === 'live' ? "bg-green-500/20 text-green-500 animate-pulse" : "bg-gold/20 text-gold"
                    )}>{match.status}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">{houses.find(h => h.id === match.team1_id)?.name || 'Team 1'}</p>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center text-xl font-display text-white"
                        defaultValue={match.score1 || 0}
                        onChange={(e) => handleAction(async () => {
                          await supabase.from('matches').update({ score1: parseInt(e.target.value) }).eq('id', match.id);
                        }, 'Update Score')}
                      />
                    </div>
                    <div className="text-2xl font-display text-white/20">VS</div>
                    <div className="flex-1 text-center space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/60">{houses.find(h => h.id === match.team2_id)?.name || 'Team 2'}</p>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-center text-xl font-display text-white"
                        defaultValue={match.score2 || 0}
                        onChange={(e) => handleAction(async () => {
                          await supabase.from('matches').update({ score2: parseInt(e.target.value) }).eq('id', match.id);
                        }, 'Update Score')}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(async () => {
                        await supabase.from('matches').update({ status: match.status === 'live' ? 'upcoming' : 'live' }).eq('id', match.id);
                      }, 'Toggle Live')}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all"
                    >
                      {match.status === 'live' ? 'Stop Live' : 'Go Live'}
                    </button>
                    <button
                      onClick={() => handleAction(async () => {
                        const winner_id = (match.score1 || 0) > (match.score2 || 0) ? match.team1_id : match.team2_id;
                        await supabase.from('matches').update({ status: 'completed', winner_id }).eq('id', match.id);
                      }, 'End Match')}
                      className="flex-1 py-3 bg-gold/20 hover:bg-gold text-gold hover:text-white rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all"
                    >End Match</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display text-white uppercase">Match Management</h3>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">Schedule and manage sports events</p>
              </div>
              <button
                onClick={() => handleAction(async () => {
                  if (categories.length === 0) throw new Error("No categories available. Add an event category first.");
                  if (houses.length < 2) throw new Error("At least 2 houses are required to create a match.");

                  const { error } = await supabase.from('matches').insert({
                    category_id: categories[0].id,
                    team1_id: houses[0].id,
                    team2_id: houses[1].id,
                    status: 'upcoming',
                    match_no: matches.length + 1
                  });
                  if (error) throw error;
                }, 'Add Match')}
                className="px-6 py-3 bg-gold text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={16} /> New Match
              </button>
            </div>
            <div className="bg-bg2 border border-white/5 rounded-[2.5rem] overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="p-6 text-[8px] font-bold text-white/40 uppercase tracking-widest">Category</th>
                      <th className="p-6 text-[8px] font-bold text-white/40 uppercase tracking-widest">Teams</th>
                      <th className="p-6 text-[8px] font-bold text-white/40 uppercase tracking-widest">Details</th>
                      <th className="p-6 text-[8px] font-bold text-white/40 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map(match => (
                      <tr key={match.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                        <td className="p-6">
                           <select
                             className="bg-transparent text-white border-none focus:ring-0 text-xs font-bold uppercase"
                             defaultValue={match.category_id}
                             onChange={(e) => handleAction(async () => {
                               await supabase.from('matches').update({ category_id: e.target.value }).eq('id', match.id);
                             }, 'Update Category')}
                           >
                             {categories.map(c => <option key={c.id} value={c.id} className="bg-bg2">{c.name}</option>)}
                           </select>
                        </td>
                        <td className="p-6">
                           <div className="flex flex-col gap-2">
                              <select
                                className="bg-transparent text-white/60 border-none focus:ring-0 text-[10px] font-bold uppercase"
                                defaultValue={match.team1_id}
                                onChange={(e) => handleAction(async () => {
                                  await supabase.from('matches').update({ team1_id: e.target.value }).eq('id', match.id);
                                }, 'Update Team 1')}
                              >
                                {houses.map(h => <option key={h.id} value={h.id} className="bg-bg2">{h.name}</option>)}
                              </select>
                              <select
                                className="bg-transparent text-white/60 border-none focus:ring-0 text-[10px] font-bold uppercase"
                                defaultValue={match.team2_id}
                                onChange={(e) => handleAction(async () => {
                                  await supabase.from('matches').update({ team2_id: e.target.value }).eq('id', match.id);
                                }, 'Update Team 2')}
                              >
                                {houses.map(h => <option key={h.id} value={h.id} className="bg-bg2">{h.name}</option>)}
                              </select>
                           </div>
                        </td>
                        <td className="p-6">
                           <input
                             className="bg-transparent text-white border-none focus:ring-0 text-xs w-full"
                             defaultValue={match.venue || ''}
                             placeholder="Set Venue"
                             onBlur={(e) => handleAction(async () => {
                               await supabase.from('matches').update({ venue: e.target.value }).eq('id', match.id);
                             }, 'Update Venue')}
                           />
                        </td>
                        <td className="p-6">
                           <button
                             onClick={() => handleAction(async () => {
                               await supabase.from('matches').delete().eq('id', match.id);
                             }, 'Delete Match')}
                             className="p-2 text-white/20 hover:text-red-500 transition-all"
                           >
                             <Trash2 size={16} />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {matches.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-white/10 uppercase text-[10px] font-bold tracking-widest">No matches found</td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display text-white uppercase">Daily Schedule</h3>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">Timeline of events and sessions</p>
              </div>
              <button
                onClick={() => handleAction(async () => {
                  await supabase.from('schedule').insert({ title: 'New Event', day_label: 'Day 1', time_start: '09:00:00' });
                }, 'Add Event')}
                className="px-6 py-3 bg-gold text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={16} /> New Event
              </button>
            </div>
            <div className="grid gap-4">
               {schedule.map(item => (
                 <div key={item.id} className="bg-bg2 border border-white/5 rounded-2xl p-6 flex items-center justify-between gap-6 group hover:border-gold/30 transition-all">
                    <div className="flex items-center gap-6 flex-1">
                       <div className="text-center min-w-[80px]">
                          <p className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">{item.day_label}</p>
                          <input
                            type="time"
                            className="bg-transparent text-white border-none focus:ring-0 text-xs text-center"
                            defaultValue={item.time_start}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('schedule').update({ time_start: e.target.value }).eq('id', item.id);
                            }, 'Update Time')}
                          />
                       </div>
                       <div className="flex-1 space-y-1">
                          <input
                            className="bg-transparent text-white border-none focus:ring-0 text-lg font-bold w-full"
                            defaultValue={item.title}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('schedule').update({ title: e.target.value }).eq('id', item.id);
                            }, 'Update Title')}
                          />
                          <input
                            className="bg-transparent text-white/40 border-none focus:ring-0 text-[10px] font-bold uppercase tracking-widest w-full"
                            defaultValue={item.subtitle || ''}
                            placeholder="Add Subtitle"
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('schedule').update({ subtitle: e.target.value }).eq('id', item.id);
                            }, 'Update Subtitle')}
                          />
                       </div>
                    </div>
                    <button onClick={() => handleAction(async () => {
                      await supabase.from('schedule').delete().eq('id', item.id);
                    }, 'Delete Event')} className="p-2 text-white/10 hover:text-red-500">
                       <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               {schedule.length === 0 && <p className="text-center text-white/10 py-12 uppercase text-[10px] font-bold tracking-widest">Schedule is empty</p>}
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-8">
             <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-display text-white uppercase">Official Notices</h3>
                <p className="text-gold text-[10px] font-bold uppercase tracking-widest mt-1">Broadcast announcements to participants</p>
              </div>
              <button
                onClick={() => handleAction(async () => {
                  await supabase.from('notices').insert({ title: 'New Announcement', content: 'Enter details here...', priority: 'medium' });
                }, 'Add Notice')}
                className="px-6 py-3 bg-gold text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={16} /> New Notice
              </button>
            </div>
            <div className="space-y-4">
               {notices.map(notice => (
                 <div key={notice.id} className="bg-bg2 border border-white/5 rounded-[2rem] p-8 space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="flex-1">
                          <input
                             className="bg-transparent text-white border-none focus:ring-0 text-xl font-bold w-full mb-2"
                             defaultValue={notice.title}
                             onBlur={(e) => handleAction(async () => {
                               await supabase.from('notices').update({ title: e.target.value }).eq('id', notice.id);
                             }, 'Update Title')}
                          />
                          <textarea
                             className="bg-transparent text-white/60 border-none focus:ring-0 text-xs w-full min-h-[80px]"
                             defaultValue={notice.content}
                             onBlur={(e) => handleAction(async () => {
                               await supabase.from('notices').update({ content: e.target.value }).eq('id', notice.id);
                             }, 'Update Content')}
                          />
                       </div>
                       <div className="flex items-center gap-4">
                          <select
                             className={cn(
                               "px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest bg-white/5 border-none",
                               notice.priority === 'high' ? "text-red-500" : "text-gold"
                             )}
                             defaultValue={notice.priority}
                             onChange={(e) => handleAction(async () => {
                               await supabase.from('notices').update({ priority: e.target.value }).eq('id', notice.id);
                             }, 'Update Priority')}
                          >
                             <option value="low" className="bg-bg2">Low</option>
                             <option value="medium" className="bg-bg2">Medium</option>
                             <option value="high" className="bg-bg2">High</option>
                          </select>
                          <button onClick={() => handleAction(async () => {
                            await supabase.from('notices').delete().eq('id', notice.id);
                          }, 'Delete Notice')} className="p-2 text-white/10 hover:text-red-500">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
               {notices.length === 0 && <p className="text-center text-white/10 py-12 uppercase text-[10px] font-bold tracking-widest">No notices posted</p>}
            </div>
          </div>
        );

      case 'leaderboards':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-display text-white uppercase">Overall Standings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {houses.map(house => (
                 <div key={house.id} className="bg-bg2 border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="flex justify-between items-center">
                       <h4 className="text-xl font-display uppercase" style={{ color: house.color }}>{house.name}</h4>
                       <span className="text-2xl font-display text-white">{house.points}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Merit Pts</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                            defaultValue={house.sports_points}
                            onBlur={(e) => handleAction(async () => {
                              const val = parseInt(e.target.value);
                              await supabase.from('houses').update({ sports_points: val, points: val + house.cultural_points }).eq('id', house.id);
                            }, 'Update Sports Points')}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Session Pts</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                            defaultValue={house.cultural_points}
                            onBlur={(e) => handleAction(async () => {
                              const val = parseInt(e.target.value);
                              await supabase.from('houses').update({ cultural_points: val, points: house.sports_points + val }).eq('id', house.id);
                            }, 'Update Cultural Points')}
                          />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-display text-gold uppercase tracking-wider">Site Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-bg2 border border-white/5 rounded-3xl p-10 space-y-6">
                {['festival_name', 'festival_subtitle', 'festival_dates', 'school_logo_url', 'announcement_text'].map(key => (
                  <div key={key} className="space-y-1">
                    <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{key.replace(/_/g, ' ')}</label>
                    {key === 'announcement_text' ? (
                      <textarea
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white min-h-[100px]"
                        defaultValue={settings[key] || ''}
                        onBlur={(e) => handleAction(async () => {
                          await supabase.from('settings').upsert({ key_name: key, val: e.target.value }, { onConflict: 'key_name' });
                        }, 'Update Setting')}
                      />
                    ) : (
                      <input
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white"
                        defaultValue={settings[key] || ''}
                        onBlur={(e) => handleAction(async () => {
                          await supabase.from('settings').upsert({ key_name: key, val: e.target.value }, { onConflict: 'key_name' });
                        }, 'Update Setting')}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-white flex overflow-hidden font-ui">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-bg2 border-r border-white/5 flex flex-col z-50 transition-transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold border border-gold/30 shadow-lg shadow-gold/10">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-display uppercase tracking-tight text-white leading-none">Harmonia MUN</h1>
              <p className="text-gold text-[8px] font-bold uppercase tracking-[0.4em] mt-1">Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'results', label: 'Score Entry', icon: Trophy },
            { id: 'matches', label: 'Match MGMT', icon: Activity },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'categories', label: 'Events', icon: Layers },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'leaderboards', label: 'Standings', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 font-bold text-[10px] uppercase tracking-widest transition-all rounded-xl border border-transparent",
                activeTab === item.id ? "bg-gold text-white shadow-lg shadow-gold/20" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4">
          <button onClick={handleLogout} className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
            <LogOut size={16} /> Logout
          </button>
          {onBack && (
            <button onClick={onBack} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
              <ExternalLink size={16} /> Back to Site
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-bg2/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-white/40 hover:text-white">
              <Shield size={20} />
            </button>
            <h2 className="text-2xl font-display uppercase tracking-tight text-white">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            {loading && <RefreshCw className="animate-spin text-gold" size={18} />}
            <button onClick={refresh} className="p-2 text-white/40 hover:text-white transition-all">
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {error && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-4 text-red-500 shadow-xl shadow-red-500/5">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest">System Error</p>
                   <p className="text-xs opacity-80">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-red-500/10 rounded-lg">
                   <X size={16} />
                </button>
              </div>
            )}
            {success && (
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-start gap-4 text-green-500 shadow-xl shadow-green-500/5 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest">Operation Success</p>
                   <p className="text-xs opacity-80">{success}</p>
                </div>
                <button onClick={() => setSuccess(null)} className="ml-auto p-1 hover:bg-green-500/10 rounded-lg">
                   <X size={16} />
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
