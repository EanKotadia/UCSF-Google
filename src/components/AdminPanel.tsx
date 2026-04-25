import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Shield,
  LogIn,
  LogOut,
  RefreshCw,
  Save,
  Trophy, 
  Calendar, 
  Settings as SettingsIcon,
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
  Clock,
  MapPin,
  History,
  FileText,
  UserPlus
} from 'lucide-react';
import { Committee, Member, Ranking, Session, Setting, Notice, StagedChange, Profile, House } from '../types';
import { cn } from '../lib/utils';

type AdminTab = 'committees' | 'members' | 'sessions' | 'rankings' | 'notices' | 'settings' | 'approvals';

interface AdminPanelProps {
  committees: Committee[];
  members: Member[];
  rankings: Ranking[];
  schedule: Session[];
  notices: Notice[];
  stagedChanges: StagedChange[];
  profile: Profile | null;
  settings: Record<string, string>;
  houses: House[];
  refresh: () => void;
  onBack?: () => void;
}

export default function AdminPanel({
  committees,
  members,
  rankings,
  schedule,
  notices,
  stagedChanges,
  profile,
  settings,
  houses,
  refresh,
  onBack
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('committees');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth check - hardcoded password as requested
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'harmonia2026') {
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

  // Helper for Supabase operations
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
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#BC8A2C]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[400px] h-[400px] bg-[#BC8A2C]/5 blur-[100px] rounded-full" />

        <div className="max-w-md w-full bg-[#0a1128]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl relative z-10">
          <div className="text-center mb-10">
            <Shield className="mx-auto text-[#BC8A2C] mb-4" size={48} />
            <h2 className="text-3xl font-display text-white uppercase tracking-wider">Admin Access</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Harmonia MUN 2026 Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-[#BC8A2C]/50 transition-all"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-4 bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#BC8A2C]/20 flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Authenticate
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
            <div className="w-10 h-10 bg-[#BC8A2C]/20 rounded-xl flex items-center justify-center text-[#BC8A2C] border border-[#BC8A2C]/30">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-xl font-display uppercase tracking-tight text-white leading-none">Harmonia</h1>
              <p className="text-[#BC8A2C] text-[8px] font-bold uppercase tracking-[0.4em] mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { id: 'committees', label: 'Committees', icon: Layers },
            { id: 'members', label: 'Secretariat & EB', icon: Users },
            { id: 'sessions', label: 'Sessions', icon: Calendar },
            { id: 'rankings', label: 'Rankings', icon: Trophy },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 font-bold text-[10px] uppercase tracking-widest transition-all rounded-xl border border-transparent",
                activeTab === item.id
                  ? "bg-[#BC8A2C] text-[#050b1a] shadow-lg shadow-[#BC8A2C]/20"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Back to Site
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
            {loading && <RefreshCw className="animate-spin text-[#BC8A2C]" size={18} />}
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
            {activeTab === 'committees' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Committee Management</h3>
                  <button
                    onClick={() => handleAction(async () => {
                      const { error } = await supabase.from('committees').insert([{
                        name: 'New Committee',
                        slug: 'new-committee-' + Date.now(),
                        description: 'Description here',
                        type: 'conventional'
                      }]);
                      if (error) throw error;
                    }, 'Add Committee')}
                    className="bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Committee
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {committees.map(c => (
                    <div key={c.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 hover:border-[#BC8A2C]/30 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/20">
                            {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover rounded-xl" /> : <Layers size={24} />}
                          </div>
                          <div>
                            <input
                              className="bg-transparent border-none text-lg font-display text-white outline-none focus:text-[#BC8A2C] w-full"
                              value={c.name}
                              onChange={(e) => handleAction(async () => {
                                await supabase.from('committees').update({ name: e.target.value }).eq('id', c.id);
                              }, 'Update Committee Name')}
                            />
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{c.slug}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAction(async () => {
                            if (!confirm('Are you sure?')) return;
                            await supabase.from('committees').delete().eq('id', c.id);
                          }, 'Delete Committee')}
                          className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white/60 outline-none focus:border-[#BC8A2C]/20 h-24 mb-4"
                        value={c.description || ''}
                        onChange={(e) => handleAction(async () => {
                          await supabase.from('committees').update({ description: e.target.value }).eq('id', c.id);
                        }, 'Update Committee Description')}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-white/20 uppercase">BG Guide URL</label>
                          <input
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white"
                            value={c.bg_guide_url || ''}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('committees').update({ bg_guide_url: e.target.value }).eq('id', c.id);
                            }, 'Update Guide URL')}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-bold text-white/20 uppercase">Type</label>
                          <select
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] text-white outline-none"
                            value={c.type || 'conventional'}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('committees').update({ type: e.target.value }).eq('id', c.id);
                            }, 'Update Committee Type')}
                          >
                            <option value="conventional">Conventional</option>
                            <option value="specialized">Specialized</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Secretariat & EB</h3>
                  <button
                    onClick={() => handleAction(async () => {
                      const { error } = await supabase.from('members').insert([{
                        name: 'New Member',
                        role: 'Role',
                        category: 'EB',
                        sort_order: 0
                      }]);
                      if (error) throw error;
                    }, 'Add Member')}
                    className="bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <UserPlus size={16} /> Add Member
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {members.map(m => (
                    <div key={m.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 group">
                       <div className="flex justify-between items-start mb-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-[#BC8A2C]/50 transition-all">
                          {m.image_url ? <img src={m.image_url} className="w-full h-full object-cover" /> : <Users className="text-white/20" />}
                        </div>
                        <button
                          onClick={() => handleAction(async () => {
                            if (!confirm('Are you sure?')) return;
                            await supabase.from('members').delete().eq('id', m.id);
                          }, 'Delete Member')}
                          className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <input
                          className="w-full bg-transparent border-none text-lg font-display text-white outline-none focus:text-[#BC8A2C]"
                          value={m.name}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('members').update({ name: e.target.value }).eq('id', m.id);
                          }, 'Update Member Name')}
                        />
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Role & Category</label>
                          <input
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white"
                            value={m.role}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('members').update({ role: e.target.value }).eq('id', m.id);
                            }, 'Update Member Role')}
                          />
                          <select
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white outline-none"
                            value={m.category}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('members').update({ category: e.target.value }).eq('id', m.id);
                            }, 'Update Member Category')}
                          >
                            <option value="Secretariat">Secretariat</option>
                            <option value="EB">Executive Board</option>
                            <option value="Director">Director</option>
                            <option value="OC">Organizing Committee</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Committee Assignment</label>
                          <select
                            className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white outline-none"
                            value={m.committee_id || ''}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('members').update({ committee_id: e.target.value || null }).eq('id', m.id);
                            }, 'Update Member Committee')}
                          >
                            <option value="">None / General</option>
                            {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Conference Schedule</h3>
                  <button
                    onClick={() => handleAction(async () => {
                      const { error } = await supabase.from('schedule').insert([{
                        title: 'New Session',
                        day_label: 'Day 1',
                        time_start: '09:00:00',
                        status: 'upcoming',
                        sort_order: 0
                      }]);
                      if (error) throw error;
                    }, 'Add Session')}
                    className="bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Session
                  </button>
                </div>
                <div className="space-y-4">
                  {schedule.map(s => (
                    <div key={s.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 flex items-center gap-8 group">
                      <div className="w-24 text-center">
                        <input
                          className="bg-transparent border-none text-[#BC8A2C] font-bold text-xs outline-none w-full text-center"
                          value={s.day_label}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('schedule').update({ day_label: e.target.value }).eq('id', s.id);
                          }, 'Update Session Day')}
                        />
                        <input
                          className="bg-transparent border-none text-white/20 text-[8px] font-bold uppercase tracking-widest w-full text-center mt-1"
                          type="time"
                          value={s.time_start}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('schedule').update({ time_start: e.target.value }).eq('id', s.id);
                          }, 'Update Session Time')}
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          className="bg-transparent border-none text-lg font-display text-white outline-none focus:text-[#BC8A2C] w-full"
                          value={s.title}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('schedule').update({ title: e.target.value }).eq('id', s.id);
                          }, 'Update Session Title')}
                        />
                        <input
                          className="bg-transparent border-none text-[10px] text-white/40 font-bold uppercase tracking-widest w-full mt-1 outline-none"
                          value={s.subtitle || ''}
                          placeholder="Subtitle / Description"
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('schedule').update({ subtitle: e.target.value }).eq('id', s.id);
                          }, 'Update Session Subtitle')}
                        />
                      </div>
                      <div className="w-48 flex items-center gap-4">
                         <select
                            className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-white outline-none flex-1"
                            value={s.status}
                            onChange={(e) => handleAction(async () => {
                              await supabase.from('schedule').update({ status: e.target.value }).eq('id', s.id);
                            }, 'Update Session Status')}
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live & Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button
                            onClick={() => handleAction(async () => {
                              if (!confirm('Are you sure?')) return;
                              await supabase.from('schedule').delete().eq('id', s.id);
                            }, 'Delete Session')}
                            className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rankings' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Delegate Rankings</h3>
                  <button
                    onClick={() => handleAction(async () => {
                      const { error } = await supabase.from('rankings').insert([{
                        name: 'Delegate Name',
                        school: 'School Name',
                        award: 'Best Delegate',
                        committee_id: committees[0]?.id || null
                      }]);
                      if (error) throw error;
                    }, 'Add Ranking')}
                    className="bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} /> Add Award
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {rankings.map(r => (
                    <div key={r.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-6 flex items-center gap-6 group">
                      <div className="w-48">
                        <select
                          className="bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-[10px] text-[#BC8A2C] outline-none w-full"
                          value={r.committee_id || ''}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('rankings').update({ committee_id: e.target.value || null }).eq('id', r.id);
                          }, 'Update Award Committee')}
                        >
                          <option value="">Select Committee</option>
                          {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <input
                          className="bg-transparent border-none text-white font-bold text-sm outline-none"
                          value={r.name}
                          placeholder="Delegate Name"
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('rankings').update({ name: e.target.value }).eq('id', r.id);
                          }, 'Update Delegate Name')}
                        />
                        <input
                          className="bg-transparent border-none text-white/60 text-sm outline-none"
                          value={r.school}
                          placeholder="School"
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('rankings').update({ school: e.target.value }).eq('id', r.id);
                          }, 'Update School')}
                        />
                        <input
                          className="bg-transparent border-none text-[#BC8A2C] font-bold text-[10px] uppercase tracking-widest outline-none"
                          value={r.award}
                          placeholder="Award Type"
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('rankings').update({ award: e.target.value }).eq('id', r.id);
                          }, 'Update Award Type')}
                        />
                      </div>
                      <button
                        onClick={() => handleAction(async () => {
                          if (!confirm('Are you sure?')) return;
                          await supabase.from('rankings').delete().eq('id', r.id);
                        }, 'Delete Award')}
                        className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notices' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Site Notices</h3>
                  <button
                    onClick={() => handleAction(async () => {
                      const { error } = await supabase.from('notices').insert([{
                        title: 'New Notice',
                        content: 'Content here',
                        priority: 'medium'
                      }]);
                      if (error) throw error;
                    }, 'Add Notice')}
                    className="bg-[#BC8A2C] hover:bg-[#a67a26] text-[#050b1a] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} /> Create Notice
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {notices.map(n => (
                    <div key={n.id} className="bg-[#0a1128] border border-white/5 rounded-2xl p-8 group relative overflow-hidden">
                       <div className={cn(
                          "absolute top-0 left-0 w-full h-1",
                          n.priority === 'high' ? "bg-red-500" : n.priority === 'medium' ? "bg-[#BC8A2C]" : "bg-blue-500"
                        )} />
                      <div className="flex justify-between items-start mb-6">
                        <select
                          className="bg-white/5 border border-white/5 rounded-lg px-3 py-1 text-[8px] font-bold text-white/40 uppercase tracking-widest outline-none"
                          value={n.priority}
                          onChange={(e) => handleAction(async () => {
                            await supabase.from('notices').update({ priority: e.target.value }).eq('id', n.id);
                          }, 'Update Priority')}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <button
                          onClick={() => handleAction(async () => {
                            if (!confirm('Are you sure?')) return;
                            await supabase.from('notices').delete().eq('id', n.id);
                          }, 'Delete Notice')}
                          className="p-2 text-white/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <input
                        className="w-full bg-transparent border-none text-2xl font-display text-white outline-none focus:text-[#BC8A2C] mb-4"
                        value={n.title}
                        onChange={(e) => handleAction(async () => {
                          await supabase.from('notices').update({ title: e.target.value }).eq('id', n.id);
                        }, 'Update Notice Title')}
                      />
                      <textarea
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-6 text-sm text-white/60 outline-none focus:border-[#BC8A2C]/20 h-32 resize-none"
                        value={n.content}
                        onChange={(e) => handleAction(async () => {
                          await supabase.from('notices').update({ content: e.target.value }).eq('id', n.id);
                        }, 'Update Notice Content')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">General Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#0a1128] border border-white/5 rounded-3xl p-10 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[#BC8A2C] text-[10px] font-bold uppercase tracking-[0.4em]">Core Info</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'festival_name', label: 'Conference Name' },
                          { key: 'festival_subtitle', label: 'Subtitle' },
                          { key: 'festival_dates', label: 'Dates' },
                          { key: 'contact_email', label: 'Contact Email' },
                        ].map(item => (
                          <div key={item.key} className="space-y-1">
                            <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest ml-1">{item.label}</label>
                            <input
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white"
                              value={settings[item.key] || ''}
                              onChange={(e) => handleAction(async () => {
                                await supabase.from('settings').upsert({ key_name: item.key, val: e.target.value }, { onConflict: 'key_name' });
                              }, `Update ${item.label}`)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0a1128] border border-white/5 rounded-3xl p-10 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[#BC8A2C] text-[10px] font-bold uppercase tracking-[0.4em]">External Links</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'instagram_url', label: 'Instagram' },
                          { key: 'facebook_url', label: 'Facebook' },
                          { key: 'youtube_url', label: 'YouTube Stream' },
                          { key: 'school_logo_url', label: 'School Logo URL' },
                        ].map(item => (
                          <div key={item.key} className="space-y-1">
                            <label className="text-[8px] font-bold text-white/20 uppercase tracking-widest ml-1">{item.label}</label>
                            <input
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-xs text-white"
                              value={settings[item.key] || ''}
                              onChange={(e) => handleAction(async () => {
                                await supabase.from('settings').upsert({ key_name: item.key, val: e.target.value }, { onConflict: 'key_name' });
                              }, `Update ${item.label}`)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <h3 className="text-xl font-display text-[#BC8A2C] uppercase tracking-wider">Pending Approvals</h3>
                <div className="bg-[#0a1128] border border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                  <CheckCircle size={64} className="text-white/10 mb-6" />
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">No staged changes requiring approval.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
