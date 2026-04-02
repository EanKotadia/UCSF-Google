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
  CheckCircle2,
  AlertCircle,
  Clock,
  LayoutDashboard,
  ChevronRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { Match, House, ScheduleItem, Category } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  matches: Match[];
  houses: House[];
  schedule: ScheduleItem[];
  categories: Category[];
  settings: Record<string, string>;
  refresh: () => void;
}

type AdminTab = 'dashboard' | 'matches' | 'schedule' | 'houses' | 'settings';

export default function AdminPanel({ matches, houses, schedule, categories, settings, refresh }: AdminPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else setSession(data.session);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
  };

  const updateMatch = async (matchId: number, updates: Partial<Match>) => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from('matches').update(updates).eq('id', matchId);
    if (error) setError(error.message);
    else {
      await supabase.rpc('recompute_points');
      refresh();
    }
    setLoading(false);
  };

  const updateSchedule = async (itemId: number, updates: Partial<ScheduleItem>) => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from('schedule').update(updates).eq('id', itemId);
    if (error) setError(error.message);
    else refresh();
    setLoading(false);
  };

  const updateSetting = async (key: string, val: string) => {
    if (!supabase) return;
    setLoading(true);
    const { error } = await supabase.from('settings').update({ val }).eq('key_name', key);
    if (error) setError(error.message);
    else refresh();
    setLoading(false);
  };

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

  const stats = useMemo(() => ({
    totalMatches: matches.length,
    liveMatches: matches.filter(m => m.status === 'live').length,
    completedMatches: matches.filter(m => m.status === 'completed').length,
    topHouse: houses[0]?.name || 'N/A',
    totalPoints: houses.reduce((acc, h) => acc + h.points, 0)
  }), [matches, houses]);

  if (!session) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass rounded-none border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="p-10">
            <div className="w-20 h-20 bg-maple rounded-none flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_30px_rgba(245,197,24,0.3)] skew-x-[-12deg]">
              <Shield size={40} className="skew-x-[12deg]" />
            </div>
            <h2 className="text-4xl font-display text-center text-white mb-2 tracking-wider uppercase">Admin Access</h2>
            <p className="font-ui text-white/40 text-center text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Secure Control Interface • UCSF 2026</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white focus:border-maple/50 outline-none transition-all font-ui text-sm font-bold tracking-widest"
                  placeholder="admin@ucsf.local"
                  required
                />
              </div>
              <div>
                <label className="block font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 text-white focus:border-maple/50 outline-none transition-all font-ui text-sm font-bold tracking-widest"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-cedar text-[10px] font-bold justify-center uppercase tracking-widest bg-cedar/10 py-2"
                >
                  <AlertCircle size={12} />
                  {error}
                </motion.div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[800px]">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 space-y-4">
        <div className="card-glass p-6 border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-maple/20 rounded-none flex items-center justify-center text-maple skew-x-[-12deg]">
              <Shield size={20} className="skew-x-[12deg]" />
            </div>
            <div>
              <h3 className="font-display text-xl text-white tracking-wider">UCSF ADMIN</h3>
              <p className="font-ui text-[8px] font-bold text-white/40 uppercase tracking-widest">v1.0.4 Stable</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'matches', label: 'Matches', icon: Activity },
              { id: 'schedule', label: 'Schedule', icon: Calendar },
              { id: 'houses', label: 'Houses', icon: Trophy },
              { id: 'settings', label: 'Settings', icon: SettingsIcon },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 font-ui text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === item.id 
                    ? "bg-maple text-black shadow-[0_0_20px_rgba(245,197,24,0.2)]" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={16} />
                {item.label}
                {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-ui text-[10px]">
                {session.user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-ui text-[10px] font-bold text-white truncate">{session.user.email}</p>
                <p className="font-ui text-[8px] font-bold text-white/20 uppercase tracking-widest">System Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 font-ui text-[10px] font-bold uppercase tracking-widest text-cedar hover:bg-cedar/10 transition-all mb-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
            <a
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3 font-ui text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all"
            >
              <Activity size={16} />
              View Live Site
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Live Events', val: stats.liveMatches, icon: Activity, color: 'text-cedar', bg: 'bg-cedar/10' },
                  { label: 'Total Matches', val: stats.totalMatches, icon: TrendingUp, color: 'text-maple', bg: 'bg-maple/10' },
                  { label: 'Leading House', val: stats.topHouse, icon: Trophy, color: 'text-white', bg: 'bg-white/10' },
                  { label: 'Total Points', val: stats.totalPoints, icon: Users, color: 'text-white/60', bg: 'bg-white/5' },
                ].map((stat, i) => (
                  <div key={i} className="card-glass p-6 border-white/10 relative overflow-hidden group">
                    <div className={cn("absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity", stat.color)}>
                      <stat.icon size={120} />
                    </div>
                    <div className={cn("w-10 h-10 rounded-none flex items-center justify-center mb-4 skew-x-[-12deg]", stat.bg, stat.color)}>
                      <stat.icon size={20} className="skew-x-[12deg]" />
                    </div>
                    <p className="font-ui text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="font-display text-4xl text-white tracking-wider">{stat.val}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity / Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="card-glass border-white/10 p-8">
                  <h3 className="text-2xl font-display text-white mb-6 tracking-wide">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => supabase?.rpc('recompute_points').then(() => refresh())}
                      className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 hover:border-maple/30 hover:bg-white/10 transition-all gap-3 group"
                    >
                      <RefreshCw size={24} className="text-maple group-hover:rotate-180 transition-transform duration-500" />
                      <span className="font-ui text-[10px] font-bold text-white uppercase tracking-widest">Recompute Points</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('matches')}
                      className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/5 hover:border-cedar/30 hover:bg-white/10 transition-all gap-3 group"
                    >
                      <Activity size={24} className="text-cedar group-hover:scale-110 transition-transform" />
                      <span className="font-ui text-[10px] font-bold text-white uppercase tracking-widest">Manage Live</span>
                    </button>
                  </div>
                </div>

                <div className="card-glass border-white/10 p-8">
                  <h3 className="text-2xl font-display text-white mb-6 tracking-wide">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cedar animate-pulse" />
                        <span className="font-ui text-[10px] font-bold text-white/60 uppercase tracking-widest">Database Connection</span>
                      </div>
                      <span className="font-ui text-[10px] font-bold text-cedar uppercase tracking-widest">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cedar animate-pulse" />
                        <span className="font-ui text-[10px] font-bold text-white/60 uppercase tracking-widest">Real-time Sync</span>
                      </div>
                      <span className="font-ui text-[10px] font-bold text-cedar uppercase tracking-widest">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'matches' && (
            <motion.div
              key="matches"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="card-glass border-white/10 p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex-1 min-w-[300px] relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search matches, teams, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white font-ui text-xs focus:border-maple/50 outline-none"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Filter className="text-white/20" size={18} />
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 text-white font-ui text-[10px] font-bold uppercase tracking-widest px-4 py-3 outline-none focus:border-maple/50"
                  >
                    <option value="all" className="bg-bg-dark">All Sports</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-bg-dark">{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card-glass border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Match</th>
                        <th className="px-8 py-6">Teams</th>
                        <th className="px-8 py-6">Score</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Winner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredMatches.map((match) => (
                        <tr key={match.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl filter drop-shadow-md">{match.category?.icon}</span>
                              <div>
                                <p className="font-ui text-[10px] font-bold text-white/60">M{match.match_no}</p>
                                <p className="font-ui text-[8px] text-white/20 uppercase tracking-widest">{match.venue}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-display text-xl text-white tracking-wide uppercase">
                              <span className={cn(match.winner_id === match.team1_id && "text-maple")}>{match.team1?.name}</span>
                              <span className="text-white/20 mx-2">vs</span>
                              <span className={cn(match.winner_id === match.team2_id && "text-maple")}>{match.team2?.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                defaultValue={match.score1 ?? 0}
                                className="w-14 px-2 py-2 bg-white/5 border border-white/10 text-white text-center font-display text-xl focus:border-maple/50 outline-none"
                                onBlur={(e) => updateMatch(match.id, { score1: parseInt(e.target.value) })}
                              />
                              <span className="text-white/20 font-display text-xl">:</span>
                              <input
                                type="number"
                                defaultValue={match.score2 ?? 0}
                                className="w-14 px-2 py-2 bg-white/5 border border-white/10 text-white text-center font-display text-xl focus:border-maple/50 outline-none"
                                onBlur={(e) => updateMatch(match.id, { score2: parseInt(e.target.value) })}
                              />
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={match.status}
                              onChange={(e) => updateMatch(match.id, { status: e.target.value as any })}
                              className={cn(
                                "bg-white/5 border border-white/10 font-ui text-[10px] font-bold uppercase tracking-widest px-3 py-2 outline-none focus:border-maple/50",
                                match.status === 'live' ? "text-cedar border-cedar/30" : "text-white"
                              )}
                            >
                              <option value="upcoming" className="bg-bg-dark text-white">Upcoming</option>
                              <option value="live" className="bg-bg-dark text-cedar">Live</option>
                              <option value="completed" className="bg-bg-dark text-white/40">Completed</option>
                            </select>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={match.winner_id || ''}
                              onChange={(e) => updateMatch(match.id, { winner_id: e.target.value || null })}
                              className="bg-white/5 border border-white/10 text-white font-ui text-[10px] font-bold uppercase tracking-widest px-3 py-2 outline-none focus:border-maple/50"
                            >
                              <option value="" className="bg-bg-dark">Draw / None</option>
                              <option value={match.team1_id} className="bg-bg-dark">{match.team1?.name}</option>
                              <option value={match.team2_id} className="bg-bg-dark">{match.team2?.name}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="card-glass border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Time</th>
                        <th className="px-8 py-6">Event</th>
                        <th className="px-8 py-6">Venue</th>
                        <th className="px-8 py-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {schedule.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-ui text-xs font-bold text-white">
                              {item.time_start}
                              {item.time_end && <span className="text-white/20 mx-1">-</span>}
                              {item.time_end}
                            </div>
                            <p className="font-ui text-[8px] text-white/20 uppercase tracking-widest">{item.day_label}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-display text-xl text-white tracking-wide uppercase">{item.title}</div>
                            <p className="font-ui text-[10px] text-white/40">{item.subtitle}</p>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-ui text-xs text-white/60">{item.venue}</div>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={item.status}
                              onChange={(e) => updateSchedule(item.id, { status: e.target.value as any })}
                              className="bg-white/5 border border-white/10 text-white font-ui text-[10px] font-bold uppercase tracking-widest px-3 py-2 outline-none focus:border-maple/50"
                            >
                              <option value="upcoming" className="bg-bg-dark">Upcoming</option>
                              <option value="live" className="bg-bg-dark">Live</option>
                              <option value="completed" className="bg-bg-dark">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'houses' && (
            <motion.div
              key="houses"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {houses.map((house) => (
                <div key={house.id} className="card-glass border-white/10 p-8 flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/5 flex items-center justify-center text-5xl filter drop-shadow-lg">
                    {house.mascot}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-3xl font-display text-white tracking-wider uppercase">{house.name}</h3>
                      <span className="font-display text-4xl text-maple">{house.points}</span>
                    </div>
                    <p className="font-ui text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">{house.motto}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-ui text-[10px] font-bold text-white/20 uppercase tracking-widest">Rank:</span>
                      <span className="font-display text-xl text-white">#{house.rank_pos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="card-glass border-white/10 p-8">
                <h3 className="text-2xl font-display text-white mb-8 tracking-wide">General Settings</h3>
                <div className="space-y-8">
                  {Object.entries(settings).map(([key, val]) => (
                    <div key={key} className="space-y-3">
                      <label className="block font-ui text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          defaultValue={val}
                          className="flex-1 px-4 py-4 bg-white/5 border border-white/10 text-white focus:border-maple/50 outline-none transition-all font-ui text-sm"
                          onBlur={(e) => updateSetting(key, e.target.value)}
                        />
                        <button className="btn-ghost px-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <Save size={16} />
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
