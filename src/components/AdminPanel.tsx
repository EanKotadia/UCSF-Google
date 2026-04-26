import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield,
  LogIn,
  LogOut,
  RefreshCw,
  Trophy, 
  Activity,
  Calendar, 
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Layers,
  ExternalLink,
  Image as ImageIcon,
  X,
  Bell,
  CheckCircle,
  FileText,
  Save,
  ChevronRight,
  User
} from 'lucide-react';
import { Match, House, ScheduleItem, Category, Notice, StagedChange, Profile, CulturalResult, GalleryItem } from '../types';
import { cn } from '../lib/utils';

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
  profile,
  settings,
  refresh,
  onBack
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('results');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ucsf2026') {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid Access Key');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleAction = async (action: () => Promise<any>, context: string) => {
    setLoading(true);
    setError(null);
    try {
      await action();
      setSuccess(`${context} successful`);
      setTimeout(() => setSuccess(null), 3000);
      refresh();
    } catch (err: any) {
      setError(`${context} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050b1a] relative overflow-hidden font-ui">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="max-w-md w-full bg-[#0a1128]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <Shield className="mx-auto text-blue-500 mb-4" size={48} />
            <h2 className="text-3xl font-display text-white uppercase tracking-wider">UCSF Admin</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Union of Culture & Sports Fest 2026</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
              <LogIn size={18} /> Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'results':
        return (
          <div className="space-y-12">
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Sports Score Entry</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.filter(m => m.status === 'live' || m.status === 'upcoming').map(match => (
                  <div key={match.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-8 space-y-6">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>{categories.find(c => c.id === match.category_id)?.name}</span>
                      <span>Match #{match.match_no}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <div className="text-center space-y-2">
                        <p className="text-sm font-bold truncate">{houses.find(h => h.id === match.team1_id)?.name}</p>
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 text-center text-2xl font-display text-white"
                          defaultValue={match.score1 || 0}
                          onBlur={(e) => handleAction(async () => {
                            await supabase.from('matches').update({ score1: parseInt(e.target.value) }).eq('id', match.id);
                          }, 'Update Score')}
                        />
                      </div>
                      <div className="text-center text-white/20 font-display text-xl">VS</div>
                      <div className="text-center space-y-2">
                        <p className="text-sm font-bold truncate">{houses.find(h => h.id === match.team2_id)?.name}</p>
                        <input
                          type="number"
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 text-center text-2xl font-display text-white"
                          defaultValue={match.score2 || 0}
                          onBlur={(e) => handleAction(async () => {
                            await supabase.from('matches').update({ score2: parseInt(e.target.value) }).eq('id', match.id);
                          }, 'Update Score')}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(async () => {
                          await supabase.from('matches').update({ status: 'live' }).eq('id', match.id);
                        }, 'Set Live')}
                        className={cn("flex-1 py-2 rounded-lg text-[8px] font-bold uppercase", match.status === 'live' ? "bg-green-500 text-white" : "bg-white/5 text-white/40")}
                      >Live</button>
                      <button
                        onClick={() => handleAction(async () => {
                          await supabase.from('matches').update({ status: 'completed' }).eq('id', match.id);
                        }, 'Complete Match')}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-[8px] font-bold uppercase"
                      >Finish</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Cultural Event Results</h3>
                  <button onClick={() => handleAction(async () => {
                    await supabase.from('cultural_results').insert([{
                      category_id: categories.find(c => c.category_type === 'cultural')?.id,
                      house_id: houses[0]?.id,
                      rank: 1,
                      points: 0
                    }]);
                  }, 'Add Result')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Plus size={16} /> Add Result
                  </button>
               </div>
               <div className="space-y-4">
                  {culturalResults.map(res => (
                    <div key={res.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 flex items-center gap-6 group">
                       <div className="w-48">
                          <select
                            className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white w-full"
                            value={res.category_id}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('cultural_results').update({ category_id: e.target.value }).eq('id', res.id);
                            }, 'Update Category')}
                          >
                            {categories.filter(c => c.category_type === 'cultural').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                       </div>
                       <div className="flex-1">
                          <select
                            className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white w-full"
                            value={res.house_id}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('cultural_results').update({ house_id: e.target.value }).eq('id', res.id);
                            }, 'Update House')}
                          >
                            {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                          </select>
                       </div>
                       <div className="w-24">
                          <input
                            type="number"
                            placeholder="Rank"
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-center font-display"
                            defaultValue={res.rank || 0}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('cultural_results').update({ rank: parseInt(e.target.value) }).eq('id', res.id);
                            }, 'Update Rank')}
                          />
                       </div>
                       <div className="w-24">
                          <input
                            type="number"
                            placeholder="Points"
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-center font-display text-blue-500"
                            defaultValue={res.points || 0}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('cultural_results').update({ points: parseInt(e.target.value) }).eq('id', res.id);
                            }, 'Update Points')}
                          />
                       </div>
                       <button onClick={() => handleAction(async () => {
                         if (confirm('Delete result?')) await supabase.from('cultural_results').delete().eq('id', res.id);
                       }, 'Delete Result')} className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
               </div>
            </section>
          </div>
        );

      case 'matches':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">All Matches</h3>
              <button onClick={() => handleAction(async () => {
                await supabase.from('matches').insert([{
                  category_id: categories[0]?.id,
                  match_no: matches.length + 1,
                  team1_id: houses[0]?.id,
                  team2_id: houses[1]?.id,
                  status: 'upcoming'
                }]);
              }, 'Add Match')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> Add Match
              </button>
            </div>
            <div className="space-y-4">
              {matches.map(m => (
                <div key={m.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 flex items-center gap-8 group">
                  <div className="w-32">
                    <select
                      className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white w-full"
                      value={m.category_id}
                      onChange={(e) => handleAction(async () => {
                        await supabase.from('matches').update({ category_id: e.target.value }).eq('id', m.id);
                      }, 'Update Category')}
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex-1 text-right">
                       <select
                          className="bg-transparent border-none text-right cursor-pointer"
                          value={m.team1_id}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('matches').update({ team1_id: e.target.value }).eq('id', m.id);
                          }, 'Update Team 1')}
                       >
                          {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                       </select>
                    </div>
                    <span className="text-white/20">vs</span>
                    <div className="flex-1">
                       <select
                          className="bg-transparent border-none cursor-pointer"
                          value={m.team2_id}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('matches').update({ team2_id: e.target.value }).eq('id', m.id);
                          }, 'Update Team 2')}
                       >
                          {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                       </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white"
                      value={m.status}
                      onChange={(e) => handleAction(async () => {
                        await supabase.from('matches').update({ status: e.target.value }).eq('id', m.id);
                      }, 'Update Status')}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => handleAction(async () => {
                      if (confirm('Delete match?')) await supabase.from('matches').delete().eq('id', m.id);
                    }, 'Delete Match')} className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Event Schedule</h3>
              <button onClick={() => handleAction(async () => {
                await supabase.from('schedule').insert([{
                  title: 'New Event',
                  day_label: 'Day 1',
                  time_start: '09:00:00',
                  status: 'upcoming'
                }]);
              }, 'Add Schedule Item')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {schedule.map(item => (
                <div key={item.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 group">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-white/40 uppercase">Title & Day</label>
                    <input
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      defaultValue={item.title}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('schedule').update({ title: e.target.value }).eq('id', item.id);
                      }, 'Update Title')}
                    />
                    <input
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      defaultValue={item.day_label}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('schedule').update({ day_label: e.target.value }).eq('id', item.id);
                      }, 'Update Day')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-white/40 uppercase">Time & Venue</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                        defaultValue={item.time_start}
                        onBlur={(e) => handleAction(async () => {
                          await supabase.from('schedule').update({ time_start: e.target.value }).eq('id', item.id);
                        }, 'Update Start Time')}
                      />
                      <input
                        type="time"
                        className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                        defaultValue={item.time_end || ''}
                        onBlur={(e) => handleAction(async () => {
                          await supabase.from('schedule').update({ time_end: e.target.value }).eq('id', item.id);
                        }, 'Update End Time')}
                      />
                    </div>
                    <input
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      placeholder="Venue"
                      defaultValue={item.venue || ''}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('schedule').update({ venue: e.target.value }).eq('id', item.id);
                      }, 'Update Venue')}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-white/40 uppercase">Status & Category</label>
                    <select
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      value={item.status}
                      onChange={(e) => handleAction(async () => {
                        await supabase.from('schedule').update({ status: e.target.value }).eq('id', item.id);
                      }, 'Update Status')}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                     <input
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs"
                      placeholder="Category"
                      defaultValue={item.category || ''}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('schedule').update({ category: e.target.value }).eq('id', item.id);
                      }, 'Update Category')}
                    />
                  </div>
                  <div className="flex items-end justify-end gap-2">
                     <button onClick={() => handleAction(async () => {
                        if (confirm('Delete item?')) await supabase.from('schedule').delete().eq('id', item.id);
                      }, 'Delete Item')} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <Trash2 size={16} />
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Event Categories</h3>
              <button onClick={() => handleAction(async () => {
                await supabase.from('categories').insert([{ name: 'New Event', category_type: 'sport', sort_order: categories.length + 1 }]);
              }, 'Add Category')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(c => (
                <div key={c.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-8 space-y-4">
                  <div className="flex justify-between">
                    <input
                      className="bg-transparent border-none text-xl font-display text-white outline-none focus:text-blue-500"
                      defaultValue={c.name}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('categories').update({ name: e.target.value }).eq('id', c.id);
                      }, 'Update Name')}
                    />
                    <button onClick={() => handleAction(async () => {
                      if (confirm('Delete category?')) await supabase.from('categories').delete().eq('id', c.id);
                    }, 'Delete Category')} className="p-2 text-white/10 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white"
                      value={c.category_type}
                      onChange={(e) => handleAction(async () => {
                        await supabase.from('categories').update({ category_type: e.target.value }).eq('id', c.id);
                      }, 'Update Type')}
                    >
                      <option value="sport">Sport</option>
                      <option value="cultural">Cultural</option>
                    </select>
                    <input
                      className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white"
                      type="number"
                      defaultValue={c.sort_order}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('categories').update({ sort_order: parseInt(e.target.value) }).eq('id', c.id);
                      }, 'Update Sort')}
                    />
                  </div>
                  <textarea
                     className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-[10px] text-white/60 h-24"
                     placeholder="Special Rules..."
                     defaultValue={c.special_rules || ''}
                     onBlur={(e) => handleAction(async () => {
                        await supabase.from('categories').update({ special_rules: e.target.value }).eq('id', c.id);
                     }, 'Update Rules')}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Notices & Announcements</h3>
              <button onClick={() => handleAction(async () => {
                await supabase.from('notices').insert([{ title: 'New Notice', content: 'Notice content here', priority: 'medium' }]);
              }, 'Add Notice')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> Add Notice
              </button>
            </div>
            <div className="space-y-4">
              {notices.map(notice => (
                <div key={notice.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-8 space-y-4 group">
                  <div className="flex justify-between items-center">
                    <input
                      className="bg-transparent border-none text-xl font-display text-white w-full mr-4"
                      defaultValue={notice.title}
                      onBlur={(e) => handleAction(async () => {
                        await supabase.from('notices').update({ title: e.target.value }).eq('id', notice.id);
                      }, 'Update Notice Title')}
                    />
                    <select
                      className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white"
                      value={notice.priority}
                      onChange={(e) => handleAction(async () => {
                        await supabase.from('notices').update({ priority: e.target.value }).eq('id', notice.id);
                      }, 'Update Priority')}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <button onClick={() => handleAction(async () => {
                      if (confirm('Delete notice?')) await supabase.from('notices').delete().eq('id', notice.id);
                    }, 'Delete Notice')} className="ml-4 p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-6 text-sm text-white/60 min-h-[100px]"
                    defaultValue={notice.content}
                    onBlur={(e) => handleAction(async () => {
                      await supabase.from('notices').update({ content: e.target.value }).eq('id', notice.id);
                    }, 'Update Content')}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Gallery Media</h3>
              <button onClick={() => handleAction(async () => {
                await supabase.from('gallery').insert([{ title: 'New Media', url: '', type: 'image' }]);
              }, 'Add Media')} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} /> Add Media
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {gallery.map(item => (
                 <div key={item.id} className="bg-[#0a1128] border border-white/5 rounded-2xl overflow-hidden group">
                    <div className="aspect-video bg-black/40 flex items-center justify-center relative">
                       {item.type === 'image' && item.url ? (
                         <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                       ) : (
                         <ImageIcon size={32} className="text-white/10" />
                       )}
                       <button onClick={() => handleAction(async () => {
                        if (confirm('Delete media?')) await supabase.from('gallery').delete().eq('id', item.id);
                       }, 'Delete Media')} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="p-4 space-y-3">
                       <input
                         className="w-full bg-transparent border-none text-xs font-bold uppercase tracking-widest"
                         defaultValue={item.title}
                         onBlur={(e) => handleAction(async () => {
                           await supabase.from('gallery').update({ title: e.target.value }).eq('id', item.id);
                         }, 'Update Title')}
                       />
                       <input
                         className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px]"
                         placeholder="Media URL"
                         defaultValue={item.url}
                         onBlur={(e) => handleAction(async () => {
                           await supabase.from('gallery').update({ url: e.target.value }).eq('id', item.id);
                         }, 'Update URL')}
                       />
                       <select
                         className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px]"
                         value={item.type}
                         onChange={(e) => handleAction(async () => {
                           await supabase.from('gallery').update({ type: e.target.value }).eq('id', item.id);
                         }, 'Update Type')}
                       >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                       </select>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        );

      case 'leaderboards':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">House Rankings & Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {houses.map(house => (
                 <div key={house.id} className="bg-[#0a1128] border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: house.color }} />
                       <h4 className="text-2xl font-display uppercase">{house.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/40 uppercase">Total Points</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xl font-display"
                            defaultValue={house.points}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('houses').update({ points: parseInt(e.target.value) }).eq('id', house.id);
                            }, 'Update Points')}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/40 uppercase">Rank Position</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-xl font-display"
                            defaultValue={house.rank_pos}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('houses').update({ rank_pos: parseInt(e.target.value) }).eq('id', house.id);
                            }, 'Update Rank')}
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/40 uppercase">Sports Points</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm"
                            defaultValue={house.sports_points}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('houses').update({ sports_points: parseInt(e.target.value) }).eq('id', house.id);
                            }, 'Update Sports Points')}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/40 uppercase">Cultural Points</label>
                          <input
                            type="number"
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm"
                            defaultValue={house.cultural_points}
                            onBlur={(e) => handleAction(async () => {
                              await supabase.from('houses').update({ cultural_points: parseInt(e.target.value) }).eq('id', house.id);
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
            <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Site Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#0a1128] border border-white/5 rounded-3xl p-10 space-y-6">
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

      case 'approvals':
        return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Pending Approvals</h3>
                <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">{stagedChanges.filter(s => s.status === 'pending').length} Pending</span>
             </div>
             {stagedChanges.filter(s => s.status === 'pending').length === 0 ? (
                <div className="py-32 text-center text-white/10">
                   <CheckCircle size={48} className="mx-auto mb-4 opacity-5" />
                   <p className="text-xs font-bold uppercase tracking-widest">No changes awaiting approval</p>
                </div>
             ) : (
                <div className="space-y-4">
                   {stagedChanges.filter(s => s.status === 'pending').map(change => (
                     <div key={change.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-8 space-y-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest mb-1">{change.table_name} Update</p>
                              <h4 className="text-lg font-bold">Request by {change.created_by_email}</h4>
                           </div>
                           <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(async () => {
                                  // This logic would involve applying the update to the actual table
                                  // For now, just mark as approved
                                  await supabase.from('staged_changes').update({ status: 'approved' }).eq('id', change.id);
                                }, 'Approve Change')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-[8px] font-bold uppercase tracking-widest"
                              >Approve</button>
                              <button
                                onClick={() => handleAction(async () => {
                                  await supabase.from('staged_changes').update({ status: 'discarded' }).eq('id', change.id);
                                }, 'Discard Change')}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-[8px] font-bold uppercase tracking-widest"
                              >Discard</button>
                           </div>
                        </div>
                        <div className="bg-black/20 rounded-xl p-6 overflow-hidden">
                           <pre className="text-[10px] text-white/40 font-mono">{JSON.stringify(change.updates, null, 2)}</pre>
                        </div>
                     </div>
                   ))}
                </div>
             )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex overflow-hidden font-ui">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#0a1128] border-r border-white/5 flex flex-col z-50 transition-transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-display uppercase tracking-tight text-white leading-none">UCSF</h1>
              <p className="text-blue-500 text-[8px] font-bold uppercase tracking-[0.4em] mt-1">Fest Admin</p>
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
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'leaderboards', label: 'Standings', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 font-bold text-[10px] uppercase tracking-widest transition-all rounded-xl border border-transparent",
                activeTab === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/40 hover:text-white hover:bg-white/5"
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
        <header className="h-20 bg-[#0a1128]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-white/40 hover:text-white">
              <Shield size={20} />
            </button>
            <h2 className="text-2xl font-display uppercase tracking-tight text-white">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            {loading && <RefreshCw className="animate-spin text-blue-500" size={18} />}
            <button onClick={refresh} className="p-2 text-white/40 hover:text-white transition-all">
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                <X size={16} /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle size={16} /> {success}
              </div>
            )}

            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
