import React, { useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield,
  LogIn,
  LogOut,
  RefreshCw,
  Save,
  Trophy, 
  Activity,
  Calendar, 
  Settings as SettingsIcon,
  Search,
  Users,
  Plus,
  Trash2,
  Edit2,
  Layers,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  X,
  Bell,
  Eye,
  CheckCircle,
  MapPin,
  History,
  Share2
} from 'lucide-react';
import { Match, House, ScheduleItem, Category, Notice, StagedChange, Profile, CulturalResult } from '../types';
import { cn } from '../lib/utils';

type AdminTab = 'results' | 'matches' | 'schedule' | 'categories' | 'notices' | 'gallery' | 'leaderboards' | 'settings' | 'approvals';

interface AdminPanelProps {
  matches: Match[];
  houses: House[];
  schedule: ScheduleItem[];
  categories: Category[];
  notices: Notice[];
  gallery: any[];
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050b1a] relative overflow-hidden">
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

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#0a1128] border-r border-white/5 flex flex-col z-50 transition-transform lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/30">
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
            { id: 'results', label: 'Event Results', icon: Trophy },
            { id: 'matches', label: 'Matches', icon: Activity },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
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

            {/* TAB CONTENT */}
            {activeTab === 'results' && (
              <div className="space-y-8">
                 <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Quick Score Entry</h3>
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
                                value={match.score1 || 0}
                                onChange={(e) => handleAction(async () => {
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
                                value={match.score2 || 0}
                                onChange={(e) => handleAction(async () => {
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
              </div>
            )}

            {activeTab === 'matches' && (
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
                      <div className="flex-1 flex items-center justify-center gap-4">
                         <span className="text-xs font-bold w-24 text-right">{houses.find(h => h.id === m.team1_id)?.name}</span>
                         <span className="text-white/20">vs</span>
                         <span className="text-xs font-bold w-24">{houses.find(h => h.id === m.team2_id)?.name}</span>
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
            )}

            {activeTab === 'categories' && (
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
                             value={c.name}
                             onChange={(e) => handleAction(async () => {
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
                             value={c.sort_order}
                             onChange={(e) => handleAction(async () => {
                               await supabase.from('categories').update({ sort_order: parseInt(e.target.value) }).eq('id', c.id);
                             }, 'Update Sort')}
                           />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Rest of the tabs follow the same pattern - simplified for space */}
            {activeTab === 'settings' && (
               <div className="space-y-6">
                <h3 className="text-xl font-display text-blue-500 uppercase tracking-wider">Site Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-[#0a1128] border border-white/5 rounded-3xl p-10 space-y-6">
                      {['festival_name', 'festival_subtitle', 'festival_dates', 'school_logo_url'].map(key => (
                        <div key={key} className="space-y-1">
                           <label className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{key.replace('_', ' ')}</label>
                           <input
                             className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white"
                             value={settings[key] || ''}
                             onChange={(e) => handleAction(async () => {
                               await supabase.from('settings').upsert({ key_name: key, val: e.target.value }, { onConflict: 'key_name' });
                             }, 'Update Setting')}
                           />
                        </div>
                      ))}
                   </div>
                </div>
               </div>
            )}

            {activeTab === 'approvals' && (
              <div className="py-20 text-center text-white/20">
                 <CheckCircle size={48} className="mx-auto mb-4 opacity-10" />
                 <p className="text-xs font-bold uppercase tracking-widest">All caught up</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
