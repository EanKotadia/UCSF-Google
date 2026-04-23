import React, { useState, useMemo } from 'react';
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
  Search,
  AlertCircle,
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
  Clock,
  MapPin,
  CheckCircle,
  History,
  Award,
  FileText,
  Heart
} from 'lucide-react';
import {
  Committee,
  Member,
  Ranking,
  Sponsor,
  ScheduleItem,
  Notice,
  StagedChange,
  Profile
} from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'committees' | 'members' | 'rankings' | 'sponsors' | 'schedule' | 'notices' | 'gallery' | 'settings' | 'changes';

interface AdminPanelProps {
  committees: Committee[];
  members: Member[];
  rankings: Ranking[];
  sponsors: Sponsor[];
  schedule: ScheduleItem[];
  notices: Notice[];
  gallery: any[];
  stagedChanges: StagedChange[];
  profile: Profile | null;
  settings: Record<string, string>;
  refresh: () => void;
  onBack?: () => void;
}

export default function AdminPanel({
  committees,
  members,
  rankings,
  sponsors,
  schedule,
  notices,
  gallery,
  stagedChanges,
  profile,
  settings,
  refresh,
  onBack
}: AdminPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('committees');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSession(data.session);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const handleSupabaseError = (err: any, context: string) => {
    console.error(`Error in ${context}:`, err);
    setError(`${context}: ${err.message}`);
    setLoading(false);
  };

  const checkSession = async () => {
    if (!supabase) return false;
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
      setSession(null);
      return false;
    }
    return true;
  };

  // Generic Update Function
  const updateRecord = async (table: string, id: string | number, updates: any) => {
    if (!supabase || !(await checkSession())) return;
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) handleSupabaseError(error, `Update ${table} failed`);
    else refresh();
  };

  // Generic Add Function
  const addRecord = async (table: string, payload: any) => {
    if (!supabase || !(await checkSession())) return;
    const { error } = await supabase.from(table).insert([payload]);
    if (error) handleSupabaseError(error, `Add ${table} failed`);
    else refresh();
  };

  // Generic Delete Function
  const deleteRecord = async (table: string, id: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete from ${table}`,
      message: 'Are you sure? This cannot be undone.',
      onConfirm: async () => {
        if (!supabase || !(await checkSession())) return;
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) handleSupabaseError(error, `Delete ${table} failed`);
        else refresh();
      }
    });
  };

  const handleSettingChange = (key: string, val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const updates = Object.entries(localSettings).map(([key, val]) => ({ key_name: key, val }));
    const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key_name' });
    if (error) handleSupabaseError(error, 'Update settings failed');
    else {
      setSuccess('Settings saved');
      setHasChanges(false);
      refresh();
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg text-white">
        <div className="card-glass p-10 max-w-md w-full">
           <h2 className="text-3xl font-display text-center mb-10 uppercase tracking-widest">Harmonia Admin</h2>
           <form onSubmit={handleLogin} className="space-y-6">
              <input type="email" placeholder="Email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 uppercase">Sign In</button>
           </form>
           {error && <p className="text-danger text-center mt-4 text-xs font-bold">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#0d1b33] border-r border-white/5 flex flex-col z-[70] transition-transform lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 border-b border-white/5 flex justify-center">
          <h1 className="text-2xl font-display tracking-widest text-white">HARMONIA <span className="text-maple">MUN</span></h1>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
           {[
             { id: 'committees', label: 'Committees', icon: Layers },
             { id: 'members', label: 'Team Members', icon: Users },
             { id: 'rankings', label: 'Rankings', icon: Award },
             { id: 'sponsors', label: 'Sponsors', icon: Heart },
             { id: 'schedule', label: 'Schedule', icon: Calendar },
             { id: 'notices', label: 'Notices', icon: Bell },
             { id: 'gallery', label: 'Gallery', icon: ImageIcon },
             { id: 'settings', label: 'Settings', icon: SettingsIcon },
           ].map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as AdminTab)}
               className={cn(
                 "w-full flex items-center gap-4 px-5 py-4 font-ui text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all",
                 activeTab === item.id ? "bg-maple text-bg" : "text-muted hover:bg-white/5"
               )}
             >
               <item.icon size={18} />
               {item.label}
             </button>
           ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3">
           {hasChanges && (
             <button onClick={saveSettings} className="w-full py-4 bg-maple text-bg font-ui text-[11px] font-bold uppercase tracking-widest rounded-xl">Save Changes</button>
           )}
           <button onClick={handleLogout} className="w-full py-4 bg-danger/10 text-danger font-ui text-[11px] font-bold uppercase tracking-widest rounded-xl">Logout</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
         <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex justify-between items-center">
               <h2 className="text-4xl font-display uppercase tracking-tighter">{activeTab}</h2>
               <button onClick={refresh} className="p-3 bg-white/5 rounded-xl text-muted hover:text-maple transition-all"><RefreshCw size={20} /></button>
            </div>

            {error && <div className="p-5 bg-danger/10 text-danger rounded-2xl text-xs">{error}</div>}
            {success && <div className="p-5 bg-success/10 text-success rounded-2xl text-xs">{success}</div>}

            <AnimatePresence mode="wait">
              {activeTab === 'committees' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('committees', { name: 'New Committee', slug: `new-${Date.now()}`, sort_order: committees.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Committee</button>
                   <div className="grid gap-6">
                      {committees.map(c => (
                        <div key={c.id} className="card-glass p-8 grid md:grid-cols-2 gap-8 relative">
                           <button onClick={() => deleteRecord('committees', c.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           <div className="space-y-4">
                              <input type="text" value={c.name} onChange={e => updateRecord('committees', c.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-2xl font-display uppercase text-white outline-none" />
                              <input type="text" value={c.slug} onChange={e => updateRecord('committees', c.id, { slug: e.target.value })} className="form-input text-xs" placeholder="Slug" />
                              <textarea value={c.description || ''} onChange={e => updateRecord('committees', c.id, { description: e.target.value })} className="form-input h-32 text-xs" placeholder="Description (Markdown)" />
                           </div>
                           <div className="space-y-4">
                              <input type="text" value={c.image_url || ''} onChange={e => updateRecord('committees', c.id, { image_url: e.target.value })} className="form-input text-xs" placeholder="Image URL" />
                              <input type="text" value={c.bg_guide_url || ''} onChange={e => updateRecord('committees', c.id, { bg_guide_url: e.target.value })} className="form-input text-xs" placeholder="Background Guide URL (PDF)" />
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] uppercase text-muted">Order:</span>
                                 <input type="number" value={c.sort_order} onChange={e => updateRecord('committees', c.id, { sort_order: parseInt(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-1 text-xs" />
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('members', { name: 'New Member', role: 'Role', category: 'Secretariat', sort_order: members.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Member</button>
                   <div className="grid gap-6">
                      {members.map(m => (
                        <div key={m.id} className="card-glass p-8 grid md:grid-cols-2 gap-8 relative">
                           <button onClick={() => deleteRecord('members', m.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           <div className="space-y-4">
                              <input type="text" value={m.name} onChange={e => updateRecord('members', m.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-xl font-display uppercase text-white outline-none" />
                              <input type="text" value={m.role} onChange={e => updateRecord('members', m.id, { role: e.target.value })} className="form-input text-xs" placeholder="Role" />
                              <select value={m.category} onChange={e => updateRecord('members', m.id, { category: e.target.value })} className="form-input text-xs">
                                 {['Secretariat', 'OC', 'EB', 'Director', "Charge d'Affaires", 'Board of Directors'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                              </select>
                              <select value={m.committee_id || ''} onChange={e => updateRecord('members', m.id, { committee_id: e.target.value || null })} className="form-input text-xs">
                                 <option value="">No Committee (Global)</option>
                                 {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                           </div>
                           <div className="space-y-4">
                              <input type="text" value={m.image_url || ''} onChange={e => updateRecord('members', m.id, { image_url: e.target.value })} className="form-input text-xs" placeholder="Image URL" />
                              <textarea value={m.bio || ''} onChange={e => updateRecord('members', m.id, { bio: e.target.value })} className="form-input h-24 text-xs" placeholder="Bio" />
                              <input type="number" value={m.sort_order} onChange={e => updateRecord('members', m.id, { sort_order: parseInt(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-1 text-xs" />
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'rankings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('rankings', { name: 'Delegate Name', school: 'School', award: 'Best Delegate', committee_id: committees[0]?.id })} className="btn-primary py-4 px-10 uppercase">+ Add Ranking</button>
                   <div className="grid gap-4">
                      {rankings.map(r => (
                        <div key={r.id} className="card-glass p-6 flex items-center gap-4 relative">
                           <button onClick={() => deleteRecord('rankings', r.id)} className="absolute top-2 right-2 text-danger/30 hover:text-danger"><Trash2 size={16} /></button>
                           <select value={r.committee_id} onChange={e => updateRecord('rankings', r.id, { committee_id: e.target.value })} className="bg-transparent border border-white/10 rounded p-2 text-xs w-48">
                              {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                           <input type="text" value={r.name} onChange={e => updateRecord('rankings', r.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 text-sm font-bold uppercase outline-none flex-1" />
                           <input type="text" value={r.school} onChange={e => updateRecord('rankings', r.id, { school: e.target.value })} className="bg-transparent border-b border-white/10 text-xs outline-none w-48" placeholder="School" />
                           <input type="text" value={r.award} onChange={e => updateRecord('rankings', r.id, { award: e.target.value })} className="bg-transparent border-b border-white/10 text-xs text-maple uppercase outline-none w-48" placeholder="Award" />
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'sponsors' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('sponsors', { name: 'New Sponsor', tier: 'Partner', sort_order: sponsors.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Sponsor</button>
                   <div className="grid gap-6">
                      {sponsors.map(s => (
                        <div key={s.id} className="card-glass p-6 grid md:grid-cols-2 gap-6 relative">
                           <button onClick={() => deleteRecord('sponsors', s.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           <div className="space-y-4">
                              <input type="text" value={s.name} onChange={e => updateRecord('sponsors', s.id, { name: e.target.value })} className="form-input" placeholder="Name" />
                              <select value={s.tier} onChange={e => updateRecord('sponsors', s.id, { tier: e.target.value })} className="form-input">
                                 {['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner'].map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                           </div>
                           <div className="space-y-4">
                              <input type="text" value={s.logo_url || ''} onChange={e => updateRecord('sponsors', s.id, { logo_url: e.target.value })} className="form-input" placeholder="Logo URL" />
                              <input type="text" value={s.website_url || ''} onChange={e => updateRecord('sponsors', s.id, { website_url: e.target.value })} className="form-input" placeholder="Website URL" />
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                   <div className="grid lg:grid-cols-2 gap-10">
                      <div className="card-glass p-10 space-y-6">
                         <h3 className="text-xl font-display uppercase text-maple border-b border-white/10 pb-4">Main Info</h3>
                         <div className="space-y-4">
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Festival Name</label><input type="text" value={localSettings['festival_name'] || ''} onChange={e => handleSettingChange('festival_name', e.target.value)} className="form-input" /></div>
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Dates & Venue</label><input type="text" value={localSettings['festival_dates'] || ''} onChange={e => handleSettingChange('festival_dates', e.target.value)} className="form-input" /></div>
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Subtitle</label><input type="text" value={localSettings['festival_subtitle'] || ''} onChange={e => handleSettingChange('festival_subtitle', e.target.value)} className="form-input" /></div>
                         </div>
                      </div>
                      <div className="card-glass p-10 space-y-6">
                         <h3 className="text-xl font-display uppercase text-maple border-b border-white/10 pb-4">Core Messages</h3>
                         <div className="space-y-4">
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Director's Message</label><textarea value={localSettings['director_msg'] || ''} onChange={e => handleSettingChange('director_msg', e.target.value)} className="form-input h-32" /></div>
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Vision</label><textarea value={localSettings['vision'] || ''} onChange={e => handleSettingChange('vision', e.target.value)} className="form-input h-24" /></div>
                         </div>
                      </div>
                      <div className="card-glass p-10 space-y-6 lg:col-span-2">
                         <h3 className="text-xl font-display uppercase text-maple border-b border-white/10 pb-4">Footer & Global</h3>
                         <div className="grid md:grid-cols-2 gap-8">
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Announcement Banner</label><textarea value={localSettings['announcement_text'] || ''} onChange={e => handleSettingChange('announcement_text', e.target.value)} className="form-input h-24" /></div>
                            <div><label className="text-[10px] uppercase text-muted mb-2 block">Footer Copyright</label><input type="text" value={localSettings['footer_text'] || ''} onChange={e => handleSettingChange('footer_text', e.target.value)} className="form-input" /></div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('schedule', { title: 'New Session', day_label: 'Day 1', time_start: '09:00 AM', status: 'upcoming', sort_order: schedule.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Session</button>
                   <div className="grid gap-6">
                      {schedule.map(s => (
                        <div key={s.id} className="card-glass p-8 grid md:grid-cols-2 gap-8 relative">
                           <button onClick={() => deleteRecord('schedule', s.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           <div className="space-y-4">
                              <input type="text" value={s.title} onChange={e => updateRecord('schedule', s.id, { title: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-xl font-display uppercase text-white outline-none" />
                              <input type="text" value={s.subtitle || ''} onChange={e => updateRecord('schedule', s.id, { subtitle: e.target.value })} className="form-input text-xs" placeholder="Subtitle" />
                              <div className="flex gap-4">
                                 <input type="text" value={s.day_label} onChange={e => updateRecord('schedule', s.id, { day_label: e.target.value })} className="form-input text-xs" placeholder="Day Label" />
                                 <input type="text" value={s.day_date} onChange={e => updateRecord('schedule', s.id, { day_date: e.target.value })} className="form-input text-xs" placeholder="Date" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex gap-4">
                                 <input type="text" value={s.time_start} onChange={e => updateRecord('schedule', s.id, { time_start: e.target.value })} className="form-input text-xs" placeholder="Start Time" />
                                 <input type="text" value={s.time_end || ''} onChange={e => updateRecord('schedule', s.id, { time_end: e.target.value })} className="form-input text-xs" placeholder="End Time" />
                              </div>
                              <div className="flex gap-4">
                                <input type="text" value={s.venue || ''} onChange={e => updateRecord('schedule', s.id, { venue: e.target.value })} className="form-input text-xs" placeholder="Venue" />
                                <select value={s.status} onChange={e => updateRecord('schedule', s.id, { status: e.target.value })} className="form-input text-xs">
                                   <option value="upcoming">Upcoming</option>
                                   <option value="live">Live</option>
                                   <option value="completed">Completed</option>
                                </select>
                              </div>
                              <input type="number" value={s.sort_order} onChange={e => updateRecord('schedule', s.id, { sort_order: parseInt(e.target.value) })} className="bg-white/5 border border-white/10 rounded px-3 py-1 text-xs" />
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'notices' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('notices', { title: 'New Notice', content: 'Content', priority: 'medium' })} className="btn-primary py-4 px-10 uppercase">+ Add Notice</button>
                   <div className="grid gap-6">
                      {notices.map(n => (
                        <div key={n.id} className="card-glass p-8 relative space-y-4">
                           <button onClick={() => deleteRecord('notices', n.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           <input type="text" value={n.title} onChange={e => updateRecord('notices', n.id, { title: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-xl font-display uppercase text-white outline-none" />
                           <div className="flex gap-4">
                              <select value={n.priority} onChange={e => updateRecord('notices', n.id, { priority: e.target.value })} className="bg-white/5 border border-white/10 rounded px-4 py-2 text-xs">
                                 <option value="low">Low</option>
                                 <option value="medium">Medium</option>
                                 <option value="high">High</option>
                              </select>
                           </div>
                           <textarea value={n.content} onChange={e => updateRecord('notices', n.id, { content: e.target.value })} className="form-input h-32 text-xs" placeholder="Content (Markdown)" />
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'gallery' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                   <button onClick={() => addRecord('gallery', { title: 'New Item', url: '', type: 'image', year: 2026 })} className="btn-primary py-4 px-10 uppercase">+ Add Media</button>
                   <div className="grid md:grid-cols-2 gap-6">
                      {gallery.map(g => (
                        <div key={g.id} className="card-glass p-6 relative space-y-4">
                           <button onClick={() => deleteRecord('gallery', g.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger"><Trash2 size={20} /></button>
                           {g.url && <img src={g.url} className="w-full h-40 object-cover rounded-xl" />}
                           <input type="text" value={g.title} onChange={e => updateRecord('gallery', g.id, { title: e.target.value })} className="form-input text-xs" placeholder="Title" />
                           <input type="text" value={g.url} onChange={e => updateRecord('gallery', g.id, { url: e.target.value })} className="form-input text-xs" placeholder="Media URL" />
                           <div className="flex gap-4">
                              <select value={g.type} onChange={e => updateRecord('gallery', g.id, { type: e.target.value })} className="form-input text-xs">
                                 <option value="image">Image</option>
                                 <option value="video">Video</option>
                              </select>
                              <input type="number" value={g.year} onChange={e => updateRecord('gallery', g.id, { year: parseInt(e.target.value) })} className="form-input text-xs" placeholder="Year" />
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </main>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
            <div className="card-glass p-12 max-w-md w-full text-center space-y-8">
               <h3 className="text-2xl font-display uppercase">{confirmModal.title}</h3>
               <p className="text-muted text-sm">{confirmModal.message}</p>
               <div className="flex gap-4 pt-6">
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-4 bg-white/5 rounded-xl uppercase font-bold text-xs">Cancel</button>
                  <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="flex-1 py-4 bg-danger text-white rounded-xl uppercase font-bold text-xs">Confirm</button>
               </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
