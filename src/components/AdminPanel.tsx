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
  Heart,
  Award,
  FileText,
  Clock,
  MapPin,
  CheckCircle,
  History,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  Eye,
  Image as ImageIcon,
  Target
} from 'lucide-react';
import {
  Committee,
  Member,
  Ranking,
  Sponsor,
  ScheduleItem,
  Profile
} from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'dashboard' | 'committees' | 'team' | 'rankings' | 'sponsors' | 'schedule' | 'messages' | 'settings';

interface AdminPanelProps {
  committees: Committee[];
  members: Member[];
  rankings: Ranking[];
  sponsors: Sponsor[];
  schedule: ScheduleItem[];
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
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>(settings);
  const [hasChanges, setHasChanges] = useState(false);

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

  const updateRecord = async (table: string, id: string | number, updates: any) => {
    if (!supabase || !(await checkSession())) return;
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) handleSupabaseError(error, `Update ${table} failed`);
    else refresh();
  };

  const addRecord = async (table: string, payload: any) => {
    if (!supabase || !(await checkSession())) return;
    const { error } = await supabase.from(table).insert([payload]);
    if (error) handleSupabaseError(error, `Add ${table} failed`);
    else refresh();
  };

  const deleteRecord = async (table: string, id: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete from ${table}`,
      message: 'Are you sure? This action cannot be undone.',
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
      setSuccess('All settings and messages saved successfully');
      setHasChanges(false);
      refresh();
      setTimeout(() => setSuccess(null), 3000);
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg text-white relative overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-ebony opacity-[0.1] blur-[100px] rounded-full" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[400px] h-[400px] bg-maple opacity-[0.05] blur-[100px] rounded-full" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-12 max-w-md w-full relative z-10 border-white/10 shadow-2xl">
           <div className="text-center mb-10">
              <h2 className="text-4xl font-display uppercase tracking-widest text-white">Harmonia <span className="text-maple">Admin</span></h2>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted mt-2">Secure Management Portal</p>
           </div>
           <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                 <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Admin Email</label>
                 <input type="email" placeholder="admin@harmonia.local" className="form-input bg-white/5 border-white/10" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                 <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted ml-1">Access Password</label>
                 <input type="password" placeholder="••••••••" className="form-input bg-white/5 border-white/10" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-5 uppercase font-bold tracking-widest flex items-center justify-center gap-3 active:scale-[0.98]">
                 {loading ? <RefreshCw className="animate-spin" size={20} /> : <Shield size={20} />}
                 Enter Portal
              </button>
           </form>
           {error && <p className="text-danger text-center mt-6 text-[10px] font-bold uppercase tracking-widest bg-danger/10 py-3 rounded-lg border border-danger/20">{error}</p>}
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'committees', label: 'Committees', icon: Layers },
    { id: 'team', label: 'Leadership', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'rankings', label: 'Rankings', icon: Award },
    { id: 'schedule', label: 'Event Flow', icon: Clock },
    { id: 'sponsors', label: 'Sponsors', icon: Heart },
    { id: 'settings', label: 'System', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-bg text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-72 bg-[#080e1a] border-r border-white/5 flex flex-col z-[70] transition-transform lg:translate-x-0 lg:static shadow-2xl",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 border-b border-white/5">
          <div className="flex flex-col items-center">
             <h1 className="text-2xl font-display tracking-widest text-white">HARMONIA</h1>
             <span className="font-ui text-[8px] font-bold text-maple tracking-[4px] mt-1">MUN ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto no-scrollbar">
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => {
                 setActiveTab(item.id as AdminTab);
                 setIsSidebarOpen(false);
               }}
               className={cn(
                 "w-full flex items-center justify-between px-5 py-4 font-ui text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all group",
                 activeTab === item.id
                   ? "bg-maple text-bg shadow-xl shadow-maple/20"
                   : "text-muted hover:bg-white/5 hover:text-text"
               )}
             >
               <div className="flex items-center gap-4">
                 <item.icon size={18} className={activeTab === item.id ? "scale-110" : "group-hover:text-maple transition-colors"} />
                 {item.label}
               </div>
               {activeTab === item.id && <ChevronRight size={14} />}
             </button>
           ))}
        </nav>
        <div className="p-6 border-t border-white/5 space-y-3">
           <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-maple/20 flex items-center justify-center text-maple text-xs font-bold">
                 {session.user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                 <p className="text-[10px] font-bold truncate text-white/80">{session.user.email}</p>
                 <p className="text-[7px] font-bold uppercase tracking-widest text-muted">Authorized Admin</p>
              </div>
           </div>
           {hasChanges && (
             <button onClick={saveSettings} className="w-full py-4 bg-maple text-bg font-ui text-[11px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-maple/30 active:scale-95 transition-transform">Save Portal Data</button>
           )}
           <button onClick={handleLogout} className="w-full py-4 bg-white/5 hover:bg-danger/10 text-muted hover:text-danger font-ui text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all border border-transparent hover:border-danger/20">Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-[#080e1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-10 flex-shrink-0 z-40">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white/5 rounded-xl text-muted"><Shield size={20} /></button>
              <div>
                 <h2 className="text-3xl font-display uppercase tracking-tighter text-white">{activeTab}</h2>
                 <p className="font-ui text-[9px] font-bold text-muted uppercase tracking-[0.4em] mt-1">Harmonia MUN 2026</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <button onClick={refresh} className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-muted hover:text-maple transition-all flex items-center justify-center"><RefreshCw size={18} /></button>
              <a href="/" target="_blank" className="hidden sm:flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl font-ui text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-all">
                 <Eye size={16} /> View Live Site
              </a>
           </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-bg">
           <div className="max-w-6xl mx-auto space-y-8">
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 border border-success/30 bg-success/5 rounded-2xl flex items-center gap-4 text-success shadow-xl shadow-success/5">
                   <CheckCircle size={20} />
                   <p className="font-ui text-[10px] font-bold uppercase tracking-widest">{success}</p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                           { label: 'Committees', val: committees.length, icon: Layers, color: 'text-maple' },
                           { label: 'EB Members', val: members.filter(m => m.category === 'EB').length, icon: Shield, color: 'text-white' },
                           { label: 'Awards Set', val: rankings.length, icon: Award, color: 'text-success' },
                           { label: 'Sponsors', val: sponsors.length, icon: Heart, color: 'text-danger' },
                        ].map((stat, i) => (
                          <div key={i} className="card-glass p-8 flex items-center gap-6 group hover:border-white/20 transition-all">
                             <div className={cn("w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                <stat.icon size={28} />
                             </div>
                             <div>
                                <div className="text-3xl font-display text-white">{stat.val}</div>
                                <div className="font-ui text-[9px] font-bold uppercase tracking-widest text-muted mt-1">{stat.label}</div>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="grid lg:grid-cols-2 gap-8">
                        <div className="card-glass p-10 space-y-6">
                           <h3 className="text-xl font-display uppercase tracking-wider text-white flex items-center gap-3"><Clock size={20} className="text-maple" /> Quick Event Flow</h3>
                           <div className="space-y-4">
                              {schedule.slice(0, 4).map(s => (
                                <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                   <div>
                                      <p className="font-display text-sm uppercase text-white">{s.title}</p>
                                      <p className="text-[10px] text-muted font-bold uppercase mt-1">{s.day_label} · {s.time_start}</p>
                                   </div>
                                   <div className={cn("px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest", s.status === 'live' ? "bg-maple/20 text-maple animate-pulse" : "bg-white/10 text-muted")}>{s.status}</div>
                                </div>
                              ))}
                              <button onClick={() => setActiveTab('schedule')} className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-maple transition-colors border-t border-white/5 pt-6">Manage Full Schedule</button>
                           </div>
                        </div>
                        <div className="card-glass p-10 space-y-6">
                           <h3 className="text-xl font-display uppercase tracking-wider text-white flex items-center gap-3"><MessageSquare size={20} className="text-maple" /> Core Messages Status</h3>
                           <div className="space-y-4">
                              {['director_msg', 'navigator_msg', 'charge_msg'].map(key => (
                                <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                   <p className="font-display text-[11px] uppercase text-white">{key.replace('_msg', "'s Message")}</p>
                                   <div className={cn("w-2 h-2 rounded-full", settings[key] ? "bg-success" : "bg-danger")} />
                                </div>
                              ))}
                              <button onClick={() => setActiveTab('messages')} className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-maple transition-colors border-t border-white/5 pt-6">Update Messages</button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}

                {activeTab === 'committees' && (
                  <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-display uppercase text-white">Committees</h3>
                           <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Management of agendas and guides</p>
                        </div>
                        <button onClick={() => addRecord('committees', { name: 'New Committee', slug: `comm-${Date.now()}`, sort_order: committees.length + 1 })} className="btn-primary py-4 px-10 uppercase flex items-center gap-3">+ Add New</button>
                     </div>
                     <div className="grid gap-8">
                        {committees.map(c => (
                          <div key={c.id} className="card-glass p-10 relative grid lg:grid-cols-3 gap-10 group overflow-hidden">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-maple opacity-0 group-hover:opacity-100 transition-opacity" />
                             <button onClick={() => deleteRecord('committees', c.id)} className="absolute top-6 right-6 w-10 h-10 bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-xl transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                             <div className="lg:col-span-1 space-y-6">
                                <div className="aspect-video bg-white/5 rounded-2xl overflow-hidden border border-white/10 group-hover:border-maple/30 transition-all flex items-center justify-center relative">
                                   {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover" /> : <Layers size={48} className="text-muted/20" />}
                                   <div className="absolute bottom-4 right-4 bg-bg/80 p-2 rounded-lg backdrop-blur-sm"><ImageIcon size={16} className="text-maple" /></div>
                                </div>
                                <div className="space-y-4">
                                   <input type="text" value={c.name} onChange={e => updateRecord('committees', c.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-2xl font-display uppercase text-white outline-none focus:border-maple" placeholder="Committee Name" />
                                   <input type="text" value={c.slug} onChange={e => updateRecord('committees', c.id, { slug: e.target.value })} className="form-input text-[11px] font-bold uppercase tracking-widest text-muted" placeholder="slug-identifier" />
                                </div>
                             </div>
                             <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Committee Banner Image URL</label>
                                      <input type="text" value={c.image_url || ''} onChange={e => updateRecord('committees', c.id, { image_url: e.target.value })} className="form-input text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Background Guide URL (PDF)</label>
                                      <input type="text" value={c.bg_guide_url || ''} onChange={e => updateRecord('committees', c.id, { bg_guide_url: e.target.value })} className="form-input text-xs" />
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Agenda & Description (Markdown)</label>
                                   <textarea value={c.description || ''} onChange={e => updateRecord('committees', c.id, { description: e.target.value })} className="form-input h-48 text-[13px] leading-relaxed" placeholder="Detailed committee agenda..." />
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-display uppercase text-white">Student Leadership</h3>
                           <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">EB, OC, and Student Directors</p>
                        </div>
                        <button onClick={() => addRecord('members', { name: 'New Leader', role: 'Role', category: 'EB', sort_order: members.length + 1 })} className="btn-primary py-4 px-10 uppercase flex items-center gap-3">+ Add Leader</button>
                     </div>
                     <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {members.filter(m => !['Navigator'].includes(m.category)).map(m => (
                          <div key={m.id} className="card-glass p-8 space-y-6 relative group overflow-hidden">
                             <button onClick={() => deleteRecord('members', m.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                             <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-white/5 rounded-2xl overflow-hidden border border-white/10 group-hover:border-maple/50 transition-all shrink-0">
                                   {m.image_url ? <img src={m.image_url} className="w-full h-full object-cover" /> : <Users size={32} className="text-muted/20" />}
                                </div>
                                <div className="flex-1 space-y-2">
                                   <input type="text" value={m.name} onChange={e => updateRecord('members', m.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-lg font-display uppercase text-white outline-none" />
                                   <select value={m.category} onChange={e => updateRecord('members', m.id, { category: e.target.value })} className="bg-transparent text-[9px] font-bold uppercase tracking-widest text-maple outline-none cursor-pointer">
                                      {["Charge d'Affaires", 'Director', 'EB', 'OC'].map(cat => <option key={cat} value={cat} className="bg-[#080e1a]">{cat}</option>)}
                                   </select>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <input type="text" value={m.role} onChange={e => updateRecord('members', m.id, { role: e.target.value })} className="form-input text-xs" placeholder="Designation (e.g. Chair)" />
                                <select value={m.committee_id || ''} onChange={e => updateRecord('members', m.id, { committee_id: e.target.value || null })} className="form-input text-[10px] font-bold uppercase tracking-widest text-muted">
                                   <option value="">No Committee (Global Role)</option>
                                   {committees.map(c => <option key={c.id} value={c.id} className="bg-[#080e1a]">{c.name}</option>)}
                                </select>
                                <input type="text" value={m.image_url || ''} onChange={e => updateRecord('members', m.id, { image_url: e.target.value })} className="form-input text-[10px]" placeholder="Profile Image URL" />
                                <textarea value={m.bio || ''} onChange={e => updateRecord('members', m.id, { bio: e.target.value })} className="form-input h-24 text-[11px]" placeholder="Short Bio (Markdown)" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'messages' && (
                  <motion.div key="msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h3 className="text-2xl font-display uppercase text-white">Management Messages</h3>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mt-1">Official statements for the About page</p>
                     </div>
                     <div className="grid gap-10">
                        {[
                           { key: 'navigator_msg', label: "Navigator's Message", subtitle: 'Senior School Management' },
                           { key: 'director_msg', label: "Director's Message", subtitle: 'Student Director' },
                           { key: 'charge_msg', label: "Charge d'Affaires' Message", subtitle: 'Secretariat Leadership' },
                        ].map(item => (
                          <div key={item.key} className="card-glass p-10 space-y-6 relative group">
                             <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                <div>
                                   <h4 className="text-2xl font-display uppercase tracking-widest text-white group-hover:text-maple transition-colors">{item.label}</h4>
                                   <p className="text-[10px] font-bold text-muted uppercase tracking-[0.4em] mt-1">{item.subtitle}</p>
                                </div>
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", localSettings[item.key] ? "border-success/30 bg-success/5 text-success" : "border-danger/30 bg-danger/5 text-danger")}>
                                   <MessageSquare size={24} />
                                </div>
                             </div>
                             <textarea
                                value={localSettings[item.key] || ''}
                                onChange={e => handleSettingChange(item.key, e.target.value)}
                                className="form-input h-80 text-[14px] leading-relaxed font-medium bg-white/2 px-8 py-8"
                                placeholder={`Enter the ${item.label.toLowerCase()} here...`}
                             />
                             <div className="flex items-center gap-3 text-muted text-[10px] font-bold uppercase tracking-widest">
                                <AlertCircle size={14} className="text-maple" />
                                <span>Markdown is supported for formatting</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'rankings' && (
                  <motion.div key="rank" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-display uppercase text-white">Conference Rankings</h3>
                           <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Committee-wise award winners</p>
                        </div>
                        <button onClick={() => addRecord('rankings', { name: 'Delegate Name', school: 'Institution', award: 'Best Delegate', committee_id: committees[0]?.id })} className="btn-primary py-4 px-10 uppercase flex items-center gap-3">+ Add Award</button>
                     </div>
                     <div className="space-y-12">
                        {committees.map(comm => {
                          const commRankings = rankings.filter(r => r.committee_id === comm.id);
                          return (
                            <div key={comm.id} className="space-y-6">
                               <div className="flex items-center gap-4 px-4">
                                  <h4 className="font-display text-xl uppercase tracking-widest text-maple">{comm.name}</h4>
                                  <div className="h-px flex-1 bg-white/5" />
                               </div>
                               <div className="grid gap-4">
                                  {commRankings.map(r => (
                                    <div key={r.id} className="card-glass p-6 flex flex-col md:flex-row items-center gap-6 relative group">
                                       <button onClick={() => deleteRecord('rankings', r.id)} className="absolute top-2 right-2 text-danger/30 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                       <div className="flex-1 space-y-4 md:space-y-0 md:flex md:items-center md:gap-8 w-full">
                                          <div className="flex-1 space-y-1">
                                             <label className="text-[8px] font-bold uppercase text-muted tracking-widest">Delegate Name</label>
                                             <input type="text" value={r.name} onChange={e => updateRecord('rankings', r.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-lg font-display text-white outline-none focus:border-maple" />
                                          </div>
                                          <div className="flex-1 space-y-1">
                                             <label className="text-[8px] font-bold uppercase text-muted tracking-widest">School/Institution</label>
                                             <input type="text" value={r.school} onChange={e => updateRecord('rankings', r.id, { school: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-[13px] font-bold text-white/80 outline-none focus:border-maple" />
                                          </div>
                                          <div className="w-64 space-y-1">
                                             <label className="text-[8px] font-bold uppercase text-muted tracking-widest">Award Category</label>
                                             <input type="text" value={r.award} onChange={e => updateRecord('rankings', r.id, { award: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-[13px] font-bold text-maple uppercase outline-none focus:border-white" />
                                          </div>
                                       </div>
                                    </div>
                                  ))}
                                  {commRankings.length === 0 && <p className="text-center py-8 text-[10px] font-bold text-muted uppercase tracking-widest italic opacity-40">No awards recorded for this committee</p>}
                               </div>
                            </div>
                          );
                        })}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'schedule' && (
                  <motion.div key="sched" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-display uppercase text-white">Event Flow</h3>
                           <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Schedule and session management</p>
                        </div>
                        <button onClick={() => addRecord('schedule', { title: 'New Session', day_label: 'Day 1', time_start: '09:00 AM', status: 'upcoming', sort_order: schedule.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Session</button>
                     </div>
                     <div className="grid gap-6">
                        {schedule.map(s => (
                          <div key={s.id} className="card-glass p-10 relative grid md:grid-cols-2 gap-10 group overflow-hidden">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-maple opacity-0 group-hover:opacity-100 transition-opacity" />
                             <button onClick={() => deleteRecord('schedule', s.id)} className="absolute top-6 right-6 text-danger/30 hover:text-danger opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                             <div className="space-y-6">
                                <div className="space-y-2">
                                   <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Session Title</label>
                                   <input type="text" value={s.title} onChange={e => updateRecord('schedule', s.id, { title: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-2xl font-display uppercase text-white outline-none focus:border-maple" />
                                </div>
                                <div className="space-y-2">
                                   <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Description</label>
                                   <textarea value={s.subtitle || ''} onChange={e => updateRecord('schedule', s.id, { subtitle: e.target.value })} className="form-input h-24 text-[12px]" placeholder="Briefly describe the session..." />
                                </div>
                             </div>
                             <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Day Label (e.g. Day 1)</label>
                                      <input type="text" value={s.day_label} onChange={e => updateRecord('schedule', s.id, { day_label: e.target.value })} className="form-input text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Date (e.g. April 10, 2026)</label>
                                      <input type="text" value={s.day_date} onChange={e => updateRecord('schedule', s.id, { day_date: e.target.value })} className="form-input text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Start Time</label>
                                      <input type="text" value={s.time_start} onChange={e => updateRecord('schedule', s.id, { time_start: e.target.value })} className="form-input text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">End Time</label>
                                      <input type="text" value={s.time_end || ''} onChange={e => updateRecord('schedule', s.id, { time_end: e.target.value })} className="form-input text-xs" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Venue</label>
                                      <input type="text" value={s.venue || ''} onChange={e => updateRecord('schedule', s.id, { venue: e.target.value })} className="form-input text-xs" />
                                   </div>
                                   <div className="space-y-2">
                                      <label className="text-[9px] font-bold uppercase text-muted tracking-widest">Manual Status Override</label>
                                      <select value={s.status} onChange={e => updateRecord('schedule', s.id, { status: e.target.value })} className="form-input text-xs">
                                         <option value="upcoming">Upcoming (Auto-mode)</option>
                                         <option value="live">Live (Manual Force)</option>
                                         <option value="completed">Completed (Manual Force)</option>
                                      </select>
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'sponsors' && (
                  <motion.div key="spon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/5">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-display uppercase text-white">Our Sponsors</h3>
                           <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">Partner and sponsor management</p>
                        </div>
                        <button onClick={() => addRecord('sponsors', { name: 'New Sponsor', tier: 'Partner', sort_order: sponsors.length + 1 })} className="btn-primary py-4 px-10 uppercase">+ Add Partner</button>
                     </div>
                     <div className="grid md:grid-cols-2 gap-8">
                        {sponsors.map(s => (
                          <div key={s.id} className="card-glass p-8 relative group space-y-6">
                             <button onClick={() => deleteRecord('sponsors', s.id)} className="absolute top-4 right-4 text-danger/30 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20} /></button>
                             <div className="flex items-center gap-8 border-b border-white/5 pb-6">
                                <div className="w-24 h-16 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center p-3 grayscale group-hover:grayscale-0 transition-all">
                                   {s.logo_url ? <img src={s.logo_url} className="max-h-full max-w-full object-contain" /> : <Heart size={24} className="text-muted/20" />}
                                </div>
                                <div className="flex-1 space-y-1">
                                   <input type="text" value={s.name} onChange={e => updateRecord('sponsors', s.id, { name: e.target.value })} className="bg-transparent border-b border-white/10 w-full text-xl font-display text-white outline-none focus:border-maple" placeholder="Sponsor Name" />
                                   <select value={s.tier} onChange={e => updateRecord('sponsors', s.id, { tier: e.target.value })} className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-maple outline-none cursor-pointer">
                                      {['Platinum', 'Gold', 'Silver', 'Bronze', 'Partner'].map(t => <option key={t} value={t} className="bg-[#080e1a]">{t}</option>)}
                                   </select>
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                   <label className="text-[8px] font-bold uppercase text-muted tracking-widest">Logo Image URL</label>
                                   <input type="text" value={s.logo_url || ''} onChange={e => updateRecord('sponsors', s.id, { logo_url: e.target.value })} className="form-input text-[11px]" />
                                </div>
                                <div className="space-y-1">
                                   <label className="text-[8px] font-bold uppercase text-muted tracking-widest">Website/External URL</label>
                                   <input type="text" value={s.website_url || ''} onChange={e => updateRecord('sponsors', s.id, { website_url: e.target.value })} className="form-input text-[11px]" />
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div key="sets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                     <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                        <h3 className="text-2xl font-display uppercase text-white">Portal Configuration</h3>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mt-1">Core conference info and visuals</p>
                     </div>
                     <div className="grid lg:grid-cols-2 gap-8">
                        <div className="card-glass p-10 space-y-8">
                           <h4 className="text-lg font-display uppercase tracking-widest text-maple flex items-center gap-3 border-b border-white/5 pb-4"><LayoutDashboard size={20} /> Basic Identity</h4>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Conference Name</label>
                                 <input type="text" value={localSettings['festival_name'] || ''} onChange={e => handleSettingChange('festival_name', e.target.value)} className="form-input" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Main Subtitle</label>
                                 <input type="text" value={localSettings['festival_subtitle'] || ''} onChange={e => handleSettingChange('festival_subtitle', e.target.value)} className="form-input" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Dates & Location</label>
                                 <input type="text" value={localSettings['festival_dates'] || ''} onChange={e => handleSettingChange('festival_dates', e.target.value)} className="form-input" />
                              </div>
                           </div>
                        </div>
                        <div className="card-glass p-10 space-y-8">
                           <h4 className="text-lg font-display uppercase tracking-widest text-maple flex items-center gap-3 border-b border-white/5 pb-4"><ImageIcon size={20} /> Branding Assets</h4>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">School Logo URL</label>
                                 <input type="text" value={localSettings['school_logo_url'] || ''} onChange={e => handleSettingChange('school_logo_url', e.target.value)} className="form-input" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Footer Copyright Text</label>
                                 <input type="text" value={localSettings['footer_text'] || ''} onChange={e => handleSettingChange('footer_text', e.target.value)} className="form-input" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Global Notice Banner</label>
                                 <input type="text" value={localSettings['announcement_text'] || ''} onChange={e => handleSettingChange('announcement_text', e.target.value)} className="form-input" placeholder="Optional text to appear at top of site" />
                              </div>
                           </div>
                        </div>
                        <div className="card-glass p-10 space-y-8 lg:col-span-2">
                           <h4 className="text-lg font-display uppercase tracking-widest text-maple flex items-center gap-3 border-b border-white/5 pb-4"><Target size={20} /> Strategic Sections</h4>
                           <div className="grid md:grid-cols-3 gap-8">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Vision Statement</label>
                                 <textarea value={localSettings['vision'] || ''} onChange={e => handleSettingChange('vision', e.target.value)} className="form-input h-40 text-xs" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Mission Statement</label>
                                 <textarea value={localSettings['mission'] || ''} onChange={e => handleSettingChange('mission', e.target.value)} className="form-input h-40 text-xs" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold uppercase text-muted tracking-widest">Core Values</label>
                                 <textarea value={localSettings['values'] || ''} onChange={e => handleSettingChange('values', e.target.value)} className="form-input h-40 text-xs" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </main>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="card-glass p-12 max-w-md w-full text-center space-y-8 shadow-3xl">
               <div className="w-20 h-20 bg-danger/10 text-danger rounded-3xl flex items-center justify-center mx-auto mb-4 border border-danger/20">
                  <AlertCircle size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-display uppercase text-white">{confirmModal.title}</h3>
                  <p className="text-muted text-sm font-medium leading-relaxed">{confirmModal.message}</p>
               </div>
               <div className="flex gap-4 pt-6">
                  <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl uppercase font-bold text-[10px] tracking-widest text-muted transition-all">Cancel</button>
                  <button onClick={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, isOpen: false }); }} className="flex-1 py-5 bg-danger text-white rounded-2xl uppercase font-bold text-[10px] tracking-widest shadow-lg shadow-danger/20 active:scale-95 transition-all">Confirm Delete</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
