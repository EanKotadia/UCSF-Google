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
  Filter,
  AlertCircle,
  Users,
  Plus,
  Trash2,
  Edit2,
  Layers,
  FileText,
  Upload,
  Image as ImageIcon,
  X,
  Bell,
  Eye,
  FileWarning,
  Share2,
  Clock,
  MapPin
} from 'lucide-react';
import { Match, House, ScheduleItem, Category, Notice } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type AdminTab = 'matches' | 'schedule' | 'houses' | 'categories' | 'notices' | 'settings';

interface AdminPanelProps {
  matches: Match[];
  houses: House[];
  schedule: ScheduleItem[];
  categories: Category[];
  notices: Notice[];
  settings: Record<string, string>;
  refresh: () => void;
}

export default function AdminPanel({ matches, houses, schedule, categories, notices, settings, refresh }: AdminPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('matches');
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local settings when settings prop changes
  React.useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleSettingChange = (key: string, val: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: val }));
    setHasChanges(true);
  };

  const saveAllSettings = async () => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Changes',
      message: 'Are you sure you want to save all configuration changes? This will update the live site immediately.',
      onConfirm: async () => {
        setLoading(true);
        try {
          const updates = Object.entries(localSettings).map(([key, val]) => ({
            key_name: key,
            val: val
          }));
          
          const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key_name' });
          if (error) throw error;
          
          setSuccess('All settings saved successfully!');
          setTimeout(() => setSuccess(null), 3000);
          refresh();
        } catch (err: any) {
          handleSupabaseError(err, 'Failed to save settings');
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
  const [noticeModal, setNoticeModal] = useState<{ isOpen: boolean; notice?: Notice } | null>(null);
  const [noticeFormData, setNoticeFormData] = useState({ title: '', content: '', priority: 'low' as 'low' | 'medium' | 'high' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setSession(data.session);
      setError(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const handleSupabaseError = (err: any, context: string) => {
    console.error(`Error in ${context}:`, err);
    if (err.message?.includes('JWT expired') || err.message?.includes('invalid_token')) {
      setError('Your session has expired. Please log in again.');
      setSession(null);
    } else {
      setError(`${context}: ${err.message}`);
    }
    setLoading(false);
  };

  const checkSession = async () => {
    if (!supabase) return false;
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    if (error || !currentSession) {
      setSession(null);
      setError('Session expired. Please log in again.');
      return false;
    }
    setSession(currentSession);
    return true;
  };

  const updateMatch = async (matchId: number, updates: Partial<Match>) => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('matches').update(updates).eq('id', matchId);
    if (error) handleSupabaseError(error, 'Failed to update match');
    else {
      await supabase.rpc('recompute_points');
      refresh();
      setLoading(false);
    }
  };

  const addMatch = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('matches').insert([{
      category_id: categories[0]?.id,
      match_no: matches.length + 1,
      team1_id: houses[0]?.id,
      team2_id: houses[1]?.id,
      status: 'upcoming',
      score1: 0,
      score2: 0
    }]);
    if (error) handleSupabaseError(error, 'Failed to add match');
    else {
      refresh();
      setLoading(false);
    }
  };

  const deleteMatch = async (id: number) => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Match',
      message: 'Are you sure you want to delete this match? This action cannot be undone.',
      onConfirm: async () => {
        setLoading(true);
        const { error } = await supabase.from('matches').delete().eq('id', id);
        if (error) handleSupabaseError(error, 'Failed to delete match');
        else {
          refresh();
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const updateSchedule = async (itemId: number, updates: Partial<ScheduleItem>) => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('schedule').update(updates).eq('id', itemId);
    if (error) handleSupabaseError(error, 'Failed to update schedule');
    else {
      refresh();
      setLoading(false);
    }
  };

  const addSchedule = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('schedule').insert([{
      day_label: 'Day 1',
      day_date: 'April 10, 2026',
      time_start: '09:00 AM',
      title: 'New Event',
      status: 'upcoming',
      sort_order: schedule.length + 1
    }]);
    if (error) handleSupabaseError(error, 'Failed to add schedule item');
    else {
      refresh();
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: number) => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      onConfirm: async () => {
        setLoading(true);
        const { error } = await supabase.from('schedule').delete().eq('id', id);
        if (error) handleSupabaseError(error, 'Failed to delete schedule item');
        else {
          refresh();
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const updateHouse = async (houseId: string, updates: Partial<House>) => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    setError(null);
    
    // Clean up numeric values
    if ('points' in updates && typeof updates.points === 'number' && isNaN(updates.points)) {
      updates.points = 0;
    }
    if ('rank_pos' in updates && typeof updates.rank_pos === 'number' && isNaN(updates.rank_pos)) {
      updates.rank_pos = 1;
    }

    const { error } = await supabase.from('houses').update(updates).eq('id', houseId);
    if (error) {
      handleSupabaseError(error, 'Failed to update house');
    } else {
      refresh();
      setLoading(false);
    }
  };

  const updateCategory = async (catId: string, updates: Partial<Category>) => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('categories').update(updates).eq('id', catId);
    if (error) handleSupabaseError(error, 'Failed to update category');
    else {
      refresh();
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('categories').insert([{
      name: 'New Sport',
      icon: '',
      category_type: 'sport',
      sort_order: categories.length + 1
    }]);
    if (error) handleSupabaseError(error, 'Failed to add category');
    else {
      refresh();
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This might affect matches linked to it.',
      onConfirm: async () => {
        setLoading(true);
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) handleSupabaseError(error, 'Failed to delete category');
        else {
          refresh();
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const addHouse = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('houses').insert([{
      name: 'New House',
      color: '#ffffff',
      mascot: '',
      points: 0,
      rank_pos: houses.length + 1,
      logo_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=NewHouse',
      banner_url: 'https://picsum.photos/seed/house/1200/400'
    }]);
    if (error) handleSupabaseError(error, 'Failed to add house');
    else {
      refresh();
      setLoading(false);
    }
  };

  const deleteHouse = async (id: string) => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete House',
      message: 'Are you sure you want to delete this house? This might affect matches linked to it.',
      onConfirm: async () => {
        setLoading(true);
        const { error } = await supabase.from('houses').delete().eq('id', id);
        if (error) handleSupabaseError(error, 'Failed to delete house');
        else {
          refresh();
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const updateSetting = async (key: string, val: string) => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    const { error } = await supabase.from('settings').upsert({ key_name: key, val }, { onConflict: 'key_name' });
    if (error) handleSupabaseError(error, 'Failed to update setting');
    else {
      setSuccess('Setting updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      refresh();
      setLoading(false);
    }
  };

  const handleNoticeSubmit = async () => {
    if (!supabase || !(await checkSession())) return;
    setLoading(true);
    try {
      if (noticeModal?.notice) {
        const { error } = await supabase.from('notices').update(noticeFormData).eq('id', noticeModal.notice.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('notices').insert([noticeFormData]);
        if (error) throw error;
      }
      setNoticeModal(null);
      setNoticeFormData({ title: '', content: '', priority: 'low' });
      refresh();
    } catch (err: any) {
      handleSupabaseError(err, 'Failed to save notice');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id: number) => {
    if (!supabase || !(await checkSession())) return;
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Notice',
      message: 'Are you sure you want to permanently delete this notice?',
      onConfirm: async () => {
        setLoading(true);
        try {
          const { error } = await supabase.from('notices').delete().eq('id', id);
          if (error) throw error;
          refresh();
        } catch (err: any) {
          handleSupabaseError(err, 'Failed to delete notice');
        } finally {
          setLoading(false);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  React.useEffect(() => {
    if (!supabase) return;

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      const matchesSearch = 
        m.team1?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.team2?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.venue?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || m.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [matches, searchQuery, categoryFilter]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Hero Orbs */}
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-ebony opacity-[0.18] blur-[100px] rounded-full animate-[orbdrift_10s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[400px] h-[400px] bg-maple opacity-[0.15] blur-[100px] rounded-full animate-[orbdrift_12s_ease-in-out_infinite_alternate-reverse]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="card-glass overflow-hidden shadow-2xl">
            <div className="p-10">
              <h2 className="text-4xl text-center text-text mb-2 tracking-wider uppercase">Admin Access</h2>
              <p className="sec-label justify-center mb-10">Secure Control Interface • UCSF 2026</p>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="admin@ucsf.local"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-danger text-[10px] font-bold justify-center uppercase tracking-widest bg-danger/10 py-2"
                  >
                    <AlertCircle size={12} />
                    {error}
                  </motion.div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {loading ? <RefreshCw className="animate-spin" size={20} /> : <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-bg text-white flex overflow-hidden">
        {/* Sidebar */}
      <aside className="w-72 bg-[#0d1b33] border-r border-white/5 flex flex-col flex-shrink-0 z-50">
        <div className="p-10 border-b border-white/5">
          <div className="flex items-center justify-center">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={localSettings['school_logo_url'] || "https://www.shalomhills.com/images/logo.png"} 
              alt="School Logo" 
              className="h-14 object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {[
            { id: 'matches', label: 'Matches', icon: Activity },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'houses', label: 'Houses', icon: Trophy },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all group rounded-2xl border border-transparent",
                activeTab === item.id 
                  ? "bg-maple text-bg shadow-xl shadow-maple/20 border-maple/50" 
                  : "text-muted hover:text-text hover:bg-white/5 hover:border-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className={cn(
                  "transition-all duration-300",
                  activeTab === item.id ? "text-bg scale-110" : "text-muted group-hover:text-maple group-hover:scale-110"
                )} />
                {item.label}
              </div>
              {item.id === 'settings' && hasChanges && (
                <div className="w-2 h-2 rounded-full bg-danger animate-pulse shadow-[0_0_15px_rgba(230,57,70,0.8)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-6">
          {hasChanges && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-danger/10 border border-danger/30 rounded-[2rem] backdrop-blur-sm"
            >
              <p className="font-ui text-[9px] font-bold text-danger uppercase tracking-[0.3em] mb-4 text-center">Unsaved Changes</p>
              <button 
                onClick={saveAllSettings}
                className="w-full py-4 bg-danger text-white font-ui text-[10px] font-bold uppercase tracking-widest hover:bg-danger/90 transition-all shadow-xl shadow-danger/30 rounded-xl active:scale-95"
              >
                Save Changes
              </button>
            </motion.div>
          )}

          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all cursor-default">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maple to-maple/50 flex items-center justify-center text-bg font-display text-lg font-bold shadow-lg shadow-maple/20">
              {session.user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="font-ui text-[11px] font-bold text-text truncate">{session.user.email}</p>
              <p className="font-ui text-[8px] font-bold text-subtle uppercase tracking-[0.4em] mt-1">System Admin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 py-4 font-ui text-[9px] font-bold uppercase tracking-widest text-danger bg-danger/5 hover:bg-danger/10 transition-all rounded-2xl border border-danger/10 active:scale-95"
            >
              <LogOut size={14} />
              Exit
            </button>
            <a
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-2 py-4 font-ui text-[9px] font-bold uppercase tracking-widest text-muted bg-white/5 hover:text-text hover:bg-white/10 transition-all rounded-2xl border border-white/5 active:scale-95"
            >
              <Eye size={14} />
              View Site
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-[#0d1b33]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-12 flex-shrink-0 z-40">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-maple border border-white/5">
              {activeTab === 'matches' && <Activity size={24} />}
              {activeTab === 'schedule' && <Calendar size={24} />}
              {activeTab === 'houses' && <Trophy size={24} />}
              {activeTab === 'categories' && <Layers size={24} />}
              {activeTab === 'notices' && <Bell size={24} />}
              {activeTab === 'settings' && <SettingsIcon size={24} />}
            </div>
            <div>
              <h2 className="text-3xl font-display tracking-tighter uppercase text-white leading-none">{activeTab}</h2>
              <p className="font-ui text-[9px] font-bold text-muted uppercase tracking-[0.4em] mt-2">Management Portal</p>
            </div>
            {loading && (
              <div className="flex items-center gap-3 text-maple font-ui text-[9px] font-bold uppercase tracking-[0.3em] bg-maple/10 px-4 py-2 rounded-full border border-maple/20 ml-4 animate-pulse">
                <RefreshCw size={12} className="animate-spin" />
                Synchronizing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl">
              <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
              <span className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.2em]">System Status: Online</span>
            </div>
            <button 
              onClick={refresh}
              className="w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-muted hover:text-maple transition-all flex items-center justify-center active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 border border-danger/30 bg-danger/5 rounded-2xl flex items-center gap-4 text-danger shadow-lg shadow-danger/5"
              >
                <div className="w-10 h-10 bg-danger/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-bold uppercase tracking-widest mb-1">System Error</p>
                  <p className="text-xs opacity-80">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="p-2 hover:bg-danger/10 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 border border-success/30 bg-success/5 rounded-2xl flex items-center gap-4 text-success shadow-lg shadow-success/5"
              >
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-ui text-[10px] font-bold uppercase tracking-widest mb-1">Success</p>
                  <p className="text-xs opacity-80">{success}</p>
                </div>
                <button onClick={() => setSuccess(null)} className="p-2 hover:bg-success/10 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'matches' && (
                <motion.div
                  key="matches"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Search & Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-6 bg-[#0d1b33] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex-1 min-w-[300px] relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-maple transition-colors" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search matches, teams, venues..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 focus:border-maple/50 focus:bg-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm outline-none transition-all placeholder:text-muted/50"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
                        <Filter className="text-muted" size={18} />
                        <select 
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="bg-transparent border-none text-[11px] font-bold uppercase tracking-[0.2em] outline-none cursor-pointer text-muted hover:text-text transition-colors"
                        >
                          <option value="all">All Categories</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-[#121214]">{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={addMatch}
                        className="bg-maple hover:bg-maple/90 text-bg py-5 px-10 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                      >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Create Match
                      </button>
                    </div>
                  </div>

                  {/* Matches List - Grouped by Category and Grade */}
                  <div className="space-y-16 pb-20">
                    {categories.map(cat => {
                      const catMatches = filteredMatches.filter(m => m.category_id === cat.id);
                      if (catMatches.length === 0 && categoryFilter !== 'all' && categoryFilter !== cat.id) return null;
                      if (catMatches.length === 0 && categoryFilter === 'all' && searchQuery === '') return null;
                      if (catMatches.length === 0 && searchQuery !== '') return null;

                      // Group matches by grade
                      const matchesByGrade: Record<string, Match[]> = {};
                      catMatches.forEach(m => {
                        const grade = 'Unassigned Grade';
                        if (!matchesByGrade[grade]) matchesByGrade[grade] = [];
                        matchesByGrade[grade].push(m);
                      });

                      return (
                        <div key={cat.id} className="space-y-10">
                          <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                            <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple text-3xl border border-maple/20 shadow-inner">
                              {cat.icon || '🏆'}
                            </div>
                            <div>
                              <h3 className="text-3xl font-display uppercase tracking-tighter text-white">{cat.name}</h3>
                              <p className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.4em] mt-2">
                                {catMatches.length} Active Records
                              </p>
                            </div>
                            <button 
                              onClick={async () => {
                                if (!supabase || !(await checkSession())) return;
                                setLoading(true);
                                const { error } = await supabase.from('matches').insert([{
                                  category_id: cat.id,
                                  match_no: matches.filter(m => m.category_id === cat.id).length + 1,
                                  team1_id: houses[0]?.id,
                                  team2_id: houses[1]?.id,
                                  status: 'upcoming',
                                  score1: 0,
                                  score2: 0
                                }]);
                                if (error) handleSupabaseError(error, 'Failed to add match');
                                else {
                                  refresh();
                                  setLoading(false);
                                }
                              }}
                              className="ml-auto w-12 h-12 bg-white/5 hover:bg-maple/20 text-muted hover:text-maple rounded-2xl transition-all border border-white/5 flex items-center justify-center active:scale-90"
                              title={`Add Match to ${cat.name}`}
                            >
                              <Plus size={24} />
                            </button>
                          </div>

                          <div className="space-y-16 pl-6 border-l-2 border-white/5">
                            {Object.entries(matchesByGrade).map(([grade, gradeMatches]) => (
                              <div key={grade} className="space-y-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-3 h-3 rounded-full bg-maple shadow-[0_0_10px_rgba(188,138,44,0.5)]" />
                                  <h4 className="text-lg font-display uppercase tracking-widest text-maple/90">{grade}</h4>
                                  <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-bold text-muted uppercase tracking-widest">{gradeMatches.length} Matches</span>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                  {gradeMatches.map((match) => (
                                    <motion.div 
                                      key={match.id}
                                      layout
                                      className="bg-bg2 border border-white/5 rounded-3xl overflow-hidden group hover:border-maple/30 transition-all shadow-xl"
                                    >
                                      <div className="p-8 flex flex-col lg:flex-row items-center gap-10">
                                        {/* Match Meta */}
                                        <div className="w-full lg:w-56 space-y-4">
                                          <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted border border-white/5 group-hover:text-maple transition-colors">
                                              <Activity size={18} />
                                            </div>
                                            <div>
                                              <div className="font-ui text-[11px] font-bold text-maple uppercase tracking-[0.2em]">{cat.name}</div>
                                              <div className="flex items-center gap-2 mt-1">
                                                <span className="font-ui text-[9px] font-bold text-muted uppercase tracking-widest">Match #</span>
                                                <input
                                                  type="number"
                                                  defaultValue={match.match_no}
                                                  className="w-12 bg-white/5 border border-white/5 rounded-lg text-white text-xs font-bold text-center py-1 outline-none focus:border-maple transition-all"
                                                  onBlur={(e) => updateMatch(match.id, { match_no: parseInt(e.target.value) })}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-3">
                                            <div className="relative">
                                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/30" size={12} />
                                              <input
                                                type="text"
                                                defaultValue={match.venue || ''}
                                                placeholder="Venue"
                                                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all"
                                                onBlur={(e) => updateMatch(match.id, { venue: e.target.value })}
                                              />
                                            </div>
                                            <div className="relative">
                                              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/30" size={12} />
                                              <input
                                                type="text"
                                                defaultValue={match.eligible_years || ''}
                                                placeholder="Eligible Years"
                                                className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all"
                                                onBlur={(e) => updateMatch(match.id, { eligible_years: e.target.value })}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Teams & Score */}
                                        <div className="flex-1 flex items-center justify-center gap-8 bg-white/5 p-8 rounded-[2rem] border border-white/5">
                                          <div className="flex-1 text-right">
                                            <select
                                              value={match.team1_id || ''}
                                              onChange={(e) => updateMatch(match.id, { team1_id: e.target.value })}
                                              className="w-full bg-transparent border-none text-xl font-display uppercase tracking-tighter text-right outline-none cursor-pointer hover:text-maple transition-colors"
                                            >
                                              {houses.map(h => (
                                                <option key={h.id} value={h.id} className="bg-[#121214]">{h.name}</option>
                                              ))}
                                            </select>
                                          </div>

                                          <div className="flex flex-col items-center gap-4">
                                            <div className="flex items-center gap-4">
                                              <input
                                                type="number"
                                                value={match.score1}
                                                onChange={(e) => updateMatch(match.id, { score1: parseInt(e.target.value) })}
                                                className="w-16 h-16 bg-bg border-2 border-white/10 rounded-2xl text-center text-3xl font-display text-white outline-none focus:border-maple transition-all shadow-inner"
                                              />
                                              <div className="text-muted font-display text-xl opacity-30">VS</div>
                                              <input
                                                type="number"
                                                value={match.score2}
                                                onChange={(e) => updateMatch(match.id, { score2: parseInt(e.target.value) })}
                                                className="w-16 h-16 bg-bg border-2 border-white/10 rounded-2xl text-center text-3xl font-display text-white outline-none focus:border-maple transition-all shadow-inner"
                                              />
                                            </div>
                                            <select
                                              value={match.status}
                                              onChange={(e) => updateMatch(match.id, { status: e.target.value as any })}
                                              className={cn(
                                                "px-4 py-2 rounded-full font-ui text-[9px] font-bold uppercase tracking-widest border transition-all cursor-pointer",
                                                match.status === 'live' ? "bg-success/10 text-success border-success/30 animate-pulse" :
                                                match.status === 'completed' ? "bg-muted/10 text-muted border-muted/30" :
                                                "bg-maple/10 text-maple border-maple/30"
                                              )}
                                            >
                                              <option value="upcoming" className="bg-[#121214]">Upcoming</option>
                                              <option value="live" className="bg-[#121214]">Live Now</option>
                                              <option value="completed" className="bg-[#121214]">Completed</option>
                                            </select>
                                          </div>

                                          <div className="flex-1 text-left">
                                            <select
                                              value={match.team2_id || ''}
                                              onChange={(e) => updateMatch(match.id, { team2_id: e.target.value })}
                                              className="w-full bg-transparent border-none text-xl font-display uppercase tracking-tighter text-left outline-none cursor-pointer hover:text-maple transition-colors"
                                            >
                                              {houses.map(h => (
                                                <option key={h.id} value={h.id} className="bg-[#121214]">{h.name}</option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex lg:flex-col gap-3">
                                          <button 
                                            onClick={() => deleteMatch(match.id)}
                                            className="w-12 h-12 bg-danger/5 hover:bg-danger text-danger hover:text-white rounded-2xl transition-all border border-danger/10 flex items-center justify-center active:scale-90"
                                            title="Delete Match"
                                          >
                                            <Trash2 size={20} />
                                          </button>
                                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted/30 border border-white/5">
                                            <Edit2 size={20} />
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {filteredMatches.length === 0 && (
                      <div className="py-32 flex flex-col items-center justify-center bg-[#121214] border border-white/5 border-dashed rounded-[3rem] text-muted gap-4">
                        <Activity size={64} className="opacity-10" />
                        <p className="font-ui text-xs font-bold uppercase tracking-widest">No matches found matching your criteria</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between bg-[#0d1b33] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div>
                      <h2 className="text-4xl font-display uppercase tracking-tighter text-white">Event Schedule</h2>
                      <p className="text-muted text-sm mt-2 font-ui uppercase tracking-[0.2em] opacity-60">Timeline of sports and cultural events</p>
                    </div>
                    <button 
                      onClick={addSchedule}
                      className="bg-maple hover:bg-maple/90 text-bg py-5 px-12 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Add Event
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {schedule.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-10 shadow-2xl group hover:border-maple/30 transition-all flex flex-col relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start mb-10">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple border border-maple/20 shadow-inner">
                              <Calendar size={28} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <input
                                  type="text"
                                  defaultValue={item.day_label}
                                  className="w-20 bg-white/5 border border-white/5 rounded-lg font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-maple outline-none focus:border-maple/50 px-2 py-1 transition-all"
                                  onBlur={(e) => updateSchedule(item.id, { day_label: e.target.value })}
                                />
                                <input
                                  type="text"
                                  defaultValue={item.day_date}
                                  className="w-28 bg-white/5 border border-white/5 rounded-lg font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted outline-none focus:border-maple/50 px-2 py-1 transition-all"
                                  onBlur={(e) => updateSchedule(item.id, { day_date: e.target.value })}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={12} className="text-muted/30" />
                                <input
                                  type="text"
                                  defaultValue={item.time_start}
                                  className="w-16 bg-transparent border-none font-ui text-[10px] font-bold uppercase tracking-widest text-subtle outline-none focus:text-white"
                                  onBlur={(e) => updateSchedule(item.id, { time_start: e.target.value })}
                                />
                                <span className="text-subtle text-[10px] opacity-30">→</span>
                                <input
                                  type="text"
                                  defaultValue={item.time_end || ''}
                                  className="w-16 bg-transparent border-none font-ui text-[10px] font-bold uppercase tracking-widest text-subtle outline-none focus:text-white"
                                  onBlur={(e) => updateSchedule(item.id, { time_end: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => deleteSchedule(item.id)}
                            className="w-12 h-12 bg-danger/5 hover:bg-danger text-danger hover:text-white rounded-2xl transition-all border border-danger/10 flex items-center justify-center active:scale-90 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="space-y-6 flex-1">
                          <input
                            type="text"
                            defaultValue={item.title}
                            className="w-full bg-transparent border-none text-3xl font-display uppercase tracking-tighter text-white outline-none focus:text-maple transition-colors"
                            onBlur={(e) => updateSchedule(item.id, { title: e.target.value })}
                          />
                          <textarea
                            defaultValue={item.subtitle || ''}
                            placeholder="Add a subtitle or description..."
                            className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-6 text-muted text-sm leading-relaxed outline-none resize-none focus:border-maple/30 focus:text-text transition-all"
                            rows={3}
                            onBlur={(e) => updateSchedule(item.id, { subtitle: e.target.value })}
                          />
                        </div>

                        <div className="pt-10 mt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Venue</label>
                            <div className="relative group/input">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within/input:text-maple transition-colors" size={16} />
                              <input
                                type="text"
                                defaultValue={item.venue || ''}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:border-maple/50 transition-all"
                                onBlur={(e) => updateSchedule(item.id, { venue: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Status</label>
                            <div className="relative group/input">
                              <div className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
                                item.status === 'live' ? "bg-maple animate-pulse" :
                                item.status === 'completed' ? "bg-success" : "bg-muted"
                              )} />
                              <select
                                value={item.status || 'upcoming'}
                                onChange={(e) => updateSchedule(item.id, { status: e.target.value as any })}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-[11px] font-bold uppercase tracking-widest text-white outline-none cursor-pointer focus:border-maple/50 transition-all"
                              >
                                <option value="upcoming" className="bg-[#121214]">Upcoming</option>
                                <option value="live" className="bg-[#121214]">Live Now</option>
                                <option value="completed" className="bg-[#121214]">Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {schedule.length === 0 && (
                      <div className="col-span-full py-40 flex flex-col items-center justify-center bg-[#0d1b33] border border-white/5 border-dashed rounded-[4rem] text-muted gap-6">
                        <Calendar size={80} className="opacity-10" />
                        <div className="text-center">
                          <p className="font-display text-2xl uppercase tracking-widest opacity-30">No events scheduled</p>
                          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] mt-2 opacity-20">Click 'Add Event' to begin</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'houses' && (
                <motion.div
                  key="houses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between bg-[#0d1b33] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div>
                      <h2 className="text-4xl font-display uppercase tracking-tighter text-white">House Management</h2>
                      <div className="flex items-center gap-6 mt-3">
                        <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Maple (Snake) • Ebony (Bull) • Cedar (Panther) • Oak (Cheetah)</p>
                        <button 
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Recompute All Points',
                              message: 'This will recalculate all house points based on current match results. Continue?',
                              onConfirm: async () => {
                                if (supabase) {
                                  await supabase.rpc('recompute_points');
                                  refresh();
                                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                  setSuccess('Points recomputed successfully');
                                  setTimeout(() => setSuccess(null), 3000);
                                }
                              }
                            });
                          }}
                          className="flex items-center gap-2 text-[10px] font-bold text-maple uppercase tracking-[0.3em] hover:text-white transition-all group active:scale-95"
                        >
                          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                          Recompute Points
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={addHouse}
                      className="bg-maple hover:bg-maple/90 text-bg py-5 px-12 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Add House
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                    {houses.map((house) => (
                      <motion.div 
                        key={house.id}
                        layout
                        className="bg-[#0d1b33] border border-white/5 rounded-[3rem] overflow-hidden group hover:border-maple/30 transition-all shadow-2xl flex flex-col relative"
                      >
                        {/* House Color Accent */}
                        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: house.color || '#ffffff' }} />
                        
                        <div className="p-10 flex items-center gap-10">
                          {/* Logo Area */}
                          <div className="relative group/logo cursor-pointer" onClick={() => document.getElementById(`house-logo-${house.id}`)?.click()}>
                            <input 
                              type="file"
                              id={`house-logo-${house.id}`}
                              className="hidden"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file || !supabase) return;
                                setLoading(true);
                                try {
                                  const fileName = `house_${house.id}_logo_${Date.now()}`;
                                  const { error: uploadError } = await supabase.storage.from('ucsf-media').upload(fileName, file);
                                  if (uploadError) throw uploadError;
                                  const { data: { publicUrl } } = supabase.storage.from('ucsf-media').getPublicUrl(fileName);
                                  await updateHouse(house.id, { logo_url: publicUrl });
                                } catch (err: any) {
                                  handleSupabaseError(err, 'Logo upload failed');
                                } finally {
                                  setLoading(false);
                                }
                              }}
                            />
                            <div className="w-36 h-36 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 overflow-hidden group-hover/logo:border-maple/50 transition-all shadow-inner relative">
                              {house.logo_url ? (
                                <img src={house.logo_url} alt={house.name} className="w-full h-full object-contain p-6" referrerPolicy="no-referrer" />
                              ) : (
                                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${house.name}`} alt={house.name} className="w-full h-full object-contain p-6 opacity-30 grayscale" referrerPolicy="no-referrer" />
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                                <Upload size={24} className="text-white" />
                                <span className="text-[8px] font-bold uppercase tracking-widest text-white">Update Logo</span>
                              </div>
                            </div>
                          </div>

                          {/* Info Area */}
                          <div className="flex-1 space-y-6">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                defaultValue={house.name}
                                className="bg-transparent border-none text-4xl font-display uppercase tracking-tighter text-white outline-none focus:text-maple transition-colors w-full"
                                onBlur={(e) => updateHouse(house.id, { name: e.target.value })}
                              />
                              <button 
                                onClick={() => deleteHouse(house.id)}
                                className="w-12 h-12 bg-danger/5 hover:bg-danger text-danger hover:text-white rounded-2xl transition-all border border-danger/10 flex items-center justify-center active:scale-90 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                              <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                                <Trophy size={20} className="text-maple" />
                                <input
                                  type="number"
                                  defaultValue={house.points}
                                  className="w-20 bg-transparent border-none text-2xl font-display text-white outline-none focus:text-maple transition-colors"
                                  onBlur={(e) => updateHouse(house.id, { points: parseInt(e.target.value) })}
                                />
                                <span className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Points</span>
                              </div>
                              <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                                <div className="w-6 h-6 rounded-full border-2 border-white/10 shadow-lg" style={{ backgroundColor: house.color || '#ffffff' }} />
                                <input
                                  type="text"
                                  defaultValue={house.color || '#ffffff'}
                                  className="w-24 bg-transparent border-none text-[12px] font-mono text-muted outline-none focus:text-white transition-colors"
                                  onBlur={(e) => updateHouse(house.id, { color: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mascot & Rank */}
                        <div className="px-10 pb-10 grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Mascot & Identity</label>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                defaultValue={house.mascot || ''}
                                placeholder="🐍"
                                className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl text-center text-3xl outline-none focus:border-maple/50 transition-all shadow-inner"
                                onBlur={(e) => updateHouse(house.id, { mascot: e.target.value })}
                              />
                              <input
                                type="text"
                                defaultValue={house.mascot_name || ''}
                                placeholder="The Viper"
                                className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all shadow-inner"
                                onBlur={(e) => updateHouse(house.id, { mascot_name: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Ranking Position</label>
                            <div className="relative group/input">
                              <Activity className="absolute left-5 top-1/2 -translate-y-1/2 text-muted/30 group-focus-within/input:text-maple transition-colors" size={18} />
                              <input
                                type="number"
                                defaultValue={house.rank_pos}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                                onBlur={(e) => updateHouse(house.id, { rank_pos: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between bg-[#0d1b33] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div>
                      <h2 className="text-4xl font-display uppercase tracking-tighter text-white">Event Categories</h2>
                      <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3 opacity-60">Define sports and cultural event specifications</p>
                    </div>
                    <button 
                      onClick={addCategory}
                      className="bg-maple hover:bg-maple/90 text-bg py-5 px-12 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Add Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {categories.map((cat) => (
                      <motion.div 
                        key={cat.id}
                        layout
                        className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-10 group hover:border-maple/30 transition-all shadow-2xl space-y-8 relative overflow-hidden"
                      >
                        <div className="flex items-start justify-between gap-8">
                          <div className="relative group/icon w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-5xl border border-white/5 group-hover:border-maple/50 transition-all overflow-hidden shadow-inner">
                            <span className="relative z-10">{cat.icon || <Layers size={32} className="text-muted/30" />}</span>
                            <input
                              type="text"
                              defaultValue={cat.icon || ''}
                              placeholder="Emoji"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              onBlur={(e) => updateCategory(cat.id, { icon: e.target.value })}
                            />
                            <div className="absolute inset-0 bg-maple/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-maple mt-14">Edit Icon</span>
                            </div>
                          </div>
                          <div className="flex-1 space-y-5">
                            <div className="flex items-center justify-between">
                              <input
                                type="text"
                                defaultValue={cat.name}
                                className="w-full bg-transparent border-none text-3xl font-display uppercase tracking-tighter text-white outline-none focus:text-maple transition-colors"
                                onBlur={(e) => updateCategory(cat.id, { name: e.target.value })}
                              />
                              <button 
                                onClick={() => deleteCategory(cat.id)}
                                className="w-10 h-10 bg-danger/5 hover:bg-danger text-danger hover:text-white rounded-xl transition-all border border-danger/10 flex items-center justify-center active:scale-90 opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                <span className="font-ui text-[9px] font-bold text-muted uppercase tracking-[0.2em]">Order</span>
                                <input
                                  type="number"
                                  defaultValue={cat.sort_order}
                                  className="w-10 bg-transparent border-none text-white text-[11px] font-bold text-center outline-none focus:text-maple"
                                  onBlur={(e) => updateCategory(cat.id, { sort_order: parseInt(e.target.value) })}
                                />
                              </div>
                              <select
                                value={cat.category_type || 'sport'}
                                onChange={(e) => updateCategory(cat.id, { category_type: e.target.value as any })}
                                className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-maple outline-none hover:bg-white/10 transition-colors cursor-pointer shadow-inner"
                              >
                                <option value="sport" className="bg-[#0d1b33]">Sport</option>
                                <option value="cultural" className="bg-[#0d1b33]">Cultural</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                          {[
                            { label: 'Gender', key: 'gender', placeholder: 'Boys/Girls' },
                            { label: 'Team Size', key: 'team_size', placeholder: '11 Players' },
                            { label: 'On Field', key: 'on_field', placeholder: '7 Players' },
                            { label: 'Duration', key: 'duration', placeholder: '20 mins' },
                            { label: 'Deadline', key: 'deadline', placeholder: 'Oct 15th' },
                            { label: 'Format', key: 'submission_format', placeholder: 'PDF/Link' }
                          ].map((field) => (
                            <div key={field.key} className="space-y-2">
                              <label className="font-ui text-[9px] font-bold text-muted uppercase tracking-[0.3em] ml-1">{field.label}</label>
                              <input
                                type="text"
                                defaultValue={cat[field.key as keyof typeof cat] || ''}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all shadow-inner"
                                onBlur={(e) => updateCategory(cat.id, { [field.key]: e.target.value })}
                              />
                            </div>
                          ))}
                          <div className="space-y-3 col-span-2 mt-4">
                            <label className="font-ui text-[9px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Category Visual</label>
                            <div className="flex gap-6">
                              <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden flex-shrink-0 shadow-inner group/img relative">
                                {cat.image_url ? (
                                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted/20">
                                    <ImageIcon size={32} />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => document.getElementById(`cat-upload-${cat.id}`)?.click()}>
                                  <Upload size={20} className="text-white" />
                                </div>
                              </div>
                              <div className="flex-grow space-y-3">
                                <input
                                  type="text"
                                  defaultValue={cat.image_url || ''}
                                  placeholder="External Image URL"
                                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all shadow-inner"
                                  onBlur={(e) => updateCategory(cat.id, { image_url: e.target.value })}
                                />
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => document.getElementById(`cat-upload-${cat.id}`)?.click()}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-ui text-[9px] font-bold uppercase tracking-[0.2em] text-muted transition-all active:scale-95 shadow-lg"
                                  >
                                    Upload
                                  </button>
                                  <input 
                                    type="file" 
                                    id={`cat-upload-${cat.id}`}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file && supabase) {
                                        setLoading(true);
                                        try {
                                          const fileName = `category-${cat.id}-${Date.now()}.${file.name.split('.').pop()}`;
                                          const { data, error } = await supabase.storage.from('ucsf-media').upload(fileName, file);
                                          if (error) throw error;
                                          if (data) {
                                            const { data: { publicUrl } } = supabase.storage.from('ucsf-media').getPublicUrl(fileName);
                                            updateCategory(cat.id, { image_url: publicUrl });
                                          }
                                        } catch (err: any) {
                                          handleSupabaseError(err, 'Image upload failed');
                                        } finally {
                                          setLoading(false);
                                        }
                                      }
                                    }}
                                  />
                                  {cat.image_url && (
                                    <button 
                                      onClick={() => updateCategory(cat.id, { image_url: null })}
                                      className="px-6 py-3 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 rounded-xl font-ui text-[9px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="font-ui text-[9px] font-bold text-muted uppercase tracking-widest">Submission Format</label>
                            <input
                              type="text"
                              defaultValue={cat.submission_format || ''}
                              placeholder="e.g. MP4/PDF"
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all"
                              onBlur={(e) => updateCategory(cat.id, { submission_format: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="font-ui text-[9px] font-bold text-muted uppercase tracking-widest">Special Rules / Description</label>
                          <textarea
                            defaultValue={cat.special_rules || ''}
                            placeholder="Enter rules, guidelines, or event description..."
                            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50 focus:text-text transition-all min-h-[100px]"
                            onBlur={(e) => updateCategory(cat.id, { special_rules: e.target.value })}
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="font-ui text-[9px] font-bold text-muted uppercase tracking-widest">Judging Criteria</label>
                          <div className="space-y-2">
                            {(cat.judging_criteria || []).map((item, i) => (
                              <div key={i} className="flex gap-2">
                                <input
                                  type="text"
                                  value={item.criterion}
                                  onChange={(e) => {
                                    const newCriteria = [...(cat.judging_criteria || [])];
                                    newCriteria[i].criterion = e.target.value;
                                    updateCategory(cat.id, { judging_criteria: newCriteria });
                                  }}
                                  className="flex-1 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50"
                                />
                                <input
                                  type="text"
                                  value={item.weight}
                                  onChange={(e) => {
                                    const newCriteria = [...(cat.judging_criteria || [])];
                                    newCriteria[i].weight = e.target.value;
                                    updateCategory(cat.id, { judging_criteria: newCriteria });
                                  }}
                                  className="w-20 bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:border-maple/50"
                                />
                                <button 
                                  onClick={() => {
                                    const newCriteria = (cat.judging_criteria || []).filter((_, idx) => idx !== i);
                                    updateCategory(cat.id, { judging_criteria: newCriteria });
                                  }}
                                  className="p-2 text-danger hover:bg-danger/10 rounded-lg"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newCriteria = [...(cat.judging_criteria || []), { criterion: 'New Criterion', weight: '20%' }];
                                updateCategory(cat.id, { judging_criteria: newCriteria });
                              }}
                              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-ui text-[8px] font-bold uppercase tracking-widest text-muted"
                            >
                              + Add Criterion
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'notices' && (
                <motion.div
                  key="notices"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between bg-[#0d1b33] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div>
                      <h2 className="text-4xl font-display uppercase tracking-tighter text-white">Notices & Bulletins</h2>
                      <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3 opacity-60">Broadcast important information to all participants</p>
                    </div>
                    <button 
                      onClick={() => {
                        setNoticeModal({ isOpen: true });
                        setNoticeFormData({ title: '', content: '', priority: 'low' });
                      }}
                      className="bg-maple hover:bg-maple/90 text-bg py-5 px-12 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      Create Notice
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {notices.map(notice => (
                      <motion.div 
                        key={notice.id} 
                        layout
                        className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-10 shadow-2xl group hover:border-maple/30 transition-all flex flex-col relative overflow-hidden"
                      >
                        {/* Priority Accent */}
                        <div className={cn(
                          "absolute top-0 left-0 w-full h-1.5",
                          notice.priority === 'high' ? "bg-danger" :
                          notice.priority === 'medium' ? "bg-maple" :
                          "bg-muted/30"
                        )} />

                        <div className="flex justify-between items-center mb-8">
                          <div className={cn(
                            "px-5 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm",
                            notice.priority === 'high' ? "bg-danger/10 text-danger border-danger/20" :
                            notice.priority === 'medium' ? "bg-maple/10 text-maple border-maple/20" :
                            "bg-white/5 text-muted border-white/10"
                          )}>
                            {notice.priority} priority
                          </div>
                          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <button 
                              onClick={() => {
                                setNoticeModal({ isOpen: true, notice });
                                setNoticeFormData({ title: notice.title, content: notice.content, priority: notice.priority });
                              }}
                              className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-maple transition-all border border-white/5 active:scale-90"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => deleteNotice(notice.id)}
                              className="w-10 h-10 bg-danger/5 hover:bg-danger text-danger hover:text-white rounded-xl flex items-center justify-center transition-all border border-danger/10 active:scale-90"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-2xl font-display uppercase tracking-tighter text-white mb-5 line-clamp-2 leading-tight">{notice.title}</h4>
                        <p className="text-muted text-[13px] leading-relaxed mb-10 flex-1 line-clamp-4 font-medium opacity-80">{notice.content}</p>
                        
                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-muted/40">
                            <Calendar size={16} className="text-maple/50" />
                            <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em]">
                              {new Date(notice.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-muted/30 group-hover:text-maple transition-colors shadow-inner">
                            <Bell size={16} />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {notices.length === 0 && (
                      <div className="col-span-full py-40 flex flex-col items-center justify-center bg-[#0d1b33] border border-white/5 border-dashed rounded-[4rem] text-muted gap-6">
                        <Bell size={80} className="opacity-10" />
                        <div className="text-center">
                          <p className="font-display text-2xl uppercase tracking-widest opacity-30">No active notices</p>
                          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] mt-2 opacity-20">Create a notice to broadcast information</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 pb-20"
                >
                  <div className="flex items-center justify-between bg-[#0d1b33] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div>
                      <h2 className="text-4xl font-display uppercase tracking-tighter text-white">General Settings</h2>
                      <p className="text-muted text-[10px] font-bold uppercase tracking-[0.3em] mt-3 opacity-60">Configure global application parameters and social links</p>
                    </div>
                    {hasChanges && (
                      <button 
                        onClick={saveAllSettings}
                        className="bg-maple hover:bg-maple/90 text-bg py-5 px-12 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 flex items-center gap-3 group active:scale-95"
                      >
                        <Save size={20} className="group-hover:scale-110 transition-transform" />
                        Save Changes
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Core Info */}
                    <div className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-maple/30" />
                      <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple shadow-inner">
                          <SettingsIcon size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display uppercase tracking-tighter text-white">Core Configuration</h3>
                          <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Basic festival information</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Festival Name</label>
                          <input
                            type="text"
                            value={localSettings['festival_name'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            onChange={(e) => handleSettingChange('festival_name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Contact Email</label>
                          <input
                            type="email"
                            value={localSettings['contact_email'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">School Logo</label>
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/5 overflow-hidden shadow-inner group/logo relative">
                              {localSettings['school_logo_url'] ? (
                                <img src={localSettings['school_logo_url']} alt="School Logo" className="w-full h-full object-contain p-4" referrerPolicy="no-referrer" />
                              ) : (
                                <ImageIcon size={32} className="text-muted/20" />
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => document.getElementById('school-logo-upload')?.click()}>
                                <Upload size={20} className="text-white" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  value={localSettings['school_logo_url'] || ''}
                                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-[11px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                                  placeholder="Logo URL..."
                                  onChange={(e) => handleSettingChange('school_logo_url', e.target.value)}
                                />
                                <button 
                                  onClick={() => document.getElementById('school-logo-upload')?.click()}
                                  className="bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl border border-white/5 transition-all active:scale-90 shadow-lg"
                                  title="Upload Logo"
                                >
                                  <Upload size={20} />
                                </button>
                                <input 
                                  type="file"
                                  id="school-logo-upload"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file || !supabase) return;
                                    setLoading(true);
                                    try {
                                      const fileName = `school_logo_${Date.now()}`;
                                      const { error: uploadError } = await supabase.storage.from('ucsf-media').upload(fileName, file);
                                      if (uploadError) throw uploadError;
                                      const { data: { publicUrl } } = supabase.storage.from('ucsf-media').getPublicUrl(fileName);
                                      handleSettingChange('school_logo_url', publicUrl);
                                    } catch (err: any) {
                                      handleSupabaseError(err, 'Logo upload failed');
                                    } finally {
                                      setLoading(false);
                                    }
                                  }}
                                />
                              </div>
                              <p className="text-[9px] text-muted uppercase tracking-[0.2em] ml-1 opacity-40">Upload a file or provide a direct URL</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Master Spreadsheet URL</label>
                          <input
                            type="text"
                            value={localSettings['master_spreadsheet_url'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            placeholder="https://docs.google.com/spreadsheets/..."
                            onChange={(e) => handleSettingChange('master_spreadsheet_url', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Status & Announcements */}
                    <div className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-maple/30" />
                      <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple shadow-inner">
                          <Activity size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display uppercase tracking-tighter text-white">Announcements</h3>
                          <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Global messaging & footer</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Global Announcement Banner</label>
                          <textarea
                            value={localSettings['announcement_text'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-6 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all min-h-[160px] resize-none shadow-inner leading-relaxed"
                            placeholder="Enter global announcement..."
                            onChange={(e) => handleSettingChange('announcement_text', e.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Footer Copyright Text</label>
                          <input
                            type="text"
                            value={localSettings['footer_text'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            placeholder="e.g. © 2026 UCSF. All rights reserved."
                            onChange={(e) => handleSettingChange('footer_text', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-[#0d1b33] border border-white/5 rounded-[3rem] p-12 space-y-10 shadow-2xl lg:col-span-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-maple/30" />
                      <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                        <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple shadow-inner">
                          <Share2 size={32} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display uppercase tracking-tighter text-white">Social & External Links</h3>
                          <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Connect your community</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Instagram URL</label>
                          <input
                            type="text"
                            value={localSettings['instagram_url'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[12px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            onChange={(e) => handleSettingChange('instagram_url', e.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Facebook URL</label>
                          <input
                            type="text"
                            value={localSettings['facebook_url'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[12px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            onChange={(e) => handleSettingChange('facebook_url', e.target.value)}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">YouTube Stream URL</label>
                          <input
                            type="text"
                            value={localSettings['youtube_url'] || ''}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[12px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                            onChange={(e) => handleSettingChange('youtube_url', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Section */}
                  <div className="opacity-20 hover:opacity-100 transition-all pt-12">
                    <h4 className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted mb-8 text-center">System Registry Keys</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {Object.entries(settings).map(([key, val]) => (
                        <div key={key} className="p-6 bg-[#0d1b33] rounded-[2rem] border border-white/5 flex flex-col gap-2 overflow-hidden shadow-inner">
                          <span className="font-mono text-[8px] text-muted/50 truncate uppercase tracking-widest">{key}</span>
                          <span className="font-ui text-[10px] font-bold text-white truncate">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>

      {/* Notice Modal */}
      <AnimatePresence>
        {noticeModal?.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0d1b33] border border-white/10 rounded-[3rem] p-12 shadow-2xl space-y-10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-maple/30" />
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-16 h-16 bg-maple/10 rounded-[1.5rem] flex items-center justify-center text-maple shadow-inner">
                  <Bell size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-display uppercase tracking-tighter text-white">
                    {noticeModal.notice ? 'Edit Notice' : 'Create Notice'}
                  </h3>
                  <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Broadcast to all participants</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Notice Title</label>
                  <input
                    type="text"
                    value={noticeFormData.title}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all shadow-inner"
                    placeholder="e.g. Football Schedule Update"
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Priority Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setNoticeFormData({ ...noticeFormData, priority: p as any })}
                        className={cn(
                          "py-4 rounded-2xl font-ui text-[10px] font-bold uppercase tracking-[0.2em] transition-all border shadow-sm active:scale-95",
                          noticeFormData.priority === p 
                            ? (p === 'high' ? "bg-danger/20 border-danger text-danger" : p === 'medium' ? "bg-maple/20 border-maple text-maple" : "bg-white/10 border-white/20 text-white")
                            : "bg-white/5 border-white/5 text-muted hover:bg-white/10"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-ui text-[10px] font-bold text-muted uppercase tracking-[0.3em] ml-1">Content Body</label>
                  <textarea
                    value={noticeFormData.content}
                    onChange={(e) => setNoticeFormData({ ...noticeFormData, content: e.target.value })}
                    className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-8 py-6 text-[13px] font-bold text-white outline-none focus:border-maple/50 transition-all min-h-[200px] resize-none leading-relaxed shadow-inner"
                    placeholder="Enter detailed notice content..."
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button
                  onClick={() => setNoticeModal(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-muted py-5 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoticeSubmit}
                  disabled={loading || !noticeFormData.title || !noticeFormData.content}
                  className="flex-1 bg-maple hover:bg-maple/90 text-bg py-5 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-maple/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? 'Saving...' : 'Publish Notice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0d1b33] border border-white/10 rounded-[3rem] p-12 shadow-2xl space-y-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-danger/30" />
              <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                <div className="w-16 h-16 bg-danger/10 rounded-[1.5rem] flex items-center justify-center text-danger shadow-inner">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-tighter text-white">{confirmModal.title}</h3>
                  <p className="text-muted text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-40">Action Required</p>
                </div>
              </div>
              
              <p className="text-muted text-[13px] leading-relaxed font-medium opacity-80">
                {confirmModal.message}
              </p>

              <div className="flex gap-6 pt-6">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-muted py-5 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={cn(
                    "flex-1 py-5 rounded-2xl font-ui text-[11px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95",
                    confirmModal.title.toLowerCase().includes('delete') 
                      ? "bg-danger hover:bg-danger/90 text-white shadow-danger/20" 
                      : "bg-maple hover:bg-maple/90 text-bg shadow-maple/20"
                  )}
                >
                  {confirmModal.title.toLowerCase().includes('delete') ? 'Confirm Delete' : 'Confirm Action'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
