import React, { useState } from 'react';
import { 
  Trophy, 
  Calendar, 
  Users,
  Settings,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Save,
  RefreshCw,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Committee, Member, Ranking, ScheduleItem, Profile } from '../types';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  schedule: ScheduleItem[];
  committees: Committee[];
  rankings: Ranking[];
  members: Member[];
  profile: Profile | null;
  settings: Record<string, string>;
  refresh: () => void;
}

type AdminTab = 'committees' | 'members' | 'rankings' | 'schedule' | 'settings';

export default function AdminPanel({ schedule, committees, rankings, members, profile, settings, refresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('committees');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    await supabase!.auth.signOut();
    window.location.reload();
  };

  const tabs = [
    { id: 'committees', label: 'Committees', icon: <Shield size={18} /> },
    { id: 'members', label: 'OC Team', icon: <Users size={18} /> },
    { id: 'rankings', label: 'Rankings', icon: <Trophy size={18} /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050b1a] text-white flex">
      <aside className="w-64 border-r border-white/5 bg-[#081021] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-maple rounded-lg flex items-center justify-center text-bg">
              <LayoutDashboard size={20} />
            </div>
            <span className="font-display text-xl uppercase tracking-wider">Harmonia <span className="text-maple">Admin</span></span>
          </div>

          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 rounded-xl font-ui text-[11px] font-bold uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-maple text-bg" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Users size={20} className="text-maple" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase text-white truncate">{profile?.email || 'Admin User'}</p>
              <p className="text-[8px] font-bold text-maple uppercase">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl font-ui text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display uppercase tracking-tight text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-white/40 text-sm">Manage your conference data in real-time.</p>
          </div>
          <button
            onClick={handleRefresh}
            className={cn(
              "p-4 bg-white/5 border border-white/10 rounded-2xl text-maple hover:bg-white/10 transition-all",
              isRefreshing && "animate-spin"
            )}
          >
            <RefreshCw size={24} />
          </button>
        </header>

        <div className="grid gap-8">
          <div className="card-glass p-8 flex flex-col items-center justify-center py-40 border-dashed">
             <div className="w-16 h-16 bg-maple/10 rounded-full flex items-center justify-center text-maple mb-6">
                <Plus size={32} />
             </div>
             <h3 className="text-xl font-display text-white uppercase mb-2">Management Interface</h3>
             <p className="text-white/30 text-sm max-w-sm text-center">
               The management tools for {activeTab} are being initialized. Please use the Google Sheets sync for immediate updates.
             </p>
             <div className="mt-8 flex gap-4">
               <button className="btn-primary">Add New Item</button>
               <button className="btn-ghost">View Settings</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
