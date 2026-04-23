import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Committee,
  Member,
  Ranking,
  Sponsor,
  ScheduleItem,
  Setting,
  Profile
} from '../types';

// Global cache to persist data across component remounts
const globalCache: Record<string, any> = {
  committees: null,
  members: null,
  rankings: null,
  sponsors: null,
  schedule: null,
  settings: null,
  profile: null,
  lastFetched: 0
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && (err.message?.includes('fetch') || err.message?.includes('lock'))) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

export function useUCSFData() {
  const [committees, setCommittees] = useState<Committee[]>(globalCache.committees || []);
  const [members, setMembers] = useState<Member[]>(globalCache.members || []);
  const [rankings, setRankings] = useState<Ranking[]>(globalCache.rankings || []);
  const [sponsors, setSponsors] = useState<Sponsor[]>(globalCache.sponsors || []);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(globalCache.schedule || []);
  const [settings, setSettings] = useState<Record<string, string>>(globalCache.settings || {});
  const [profile, setProfile] = useState<Profile | null>(globalCache.profile || null);
  const [loading, setLoading] = useState(!globalCache.lastFetched);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommittees = async () => {
    const { data } = await supabase!.from('committees').select('*').order('sort_order', { ascending: true });
    if (data) {
      setCommittees(data);
      globalCache.committees = data;
    }
  };

  const fetchMembers = async () => {
    const { data } = await supabase!.from('members').select('*, committee:committee_id(*)').order('sort_order', { ascending: true });
    if (data) {
      setMembers(data);
      globalCache.members = data;
    }
  };

  const fetchRankings = async () => {
    const { data } = await supabase!.from('rankings').select('*, committee:committee_id(*)').order('id', { ascending: true });
    if (data) {
      setRankings(data);
      globalCache.rankings = data;
    }
  };

  const fetchSponsors = async () => {
    const { data } = await supabase!.from('sponsors').select('*').order('sort_order', { ascending: true });
    if (data) {
      setSponsors(data);
      globalCache.sponsors = data;
    }
  };

  const fetchSchedule = async () => {
    const { data } = await supabase!.from('schedule').select('*').order('sort_order', { ascending: true });
    if (data) {
      setSchedule(data);
      globalCache.schedule = data;
    }
  };

  const fetchSettings = async () => {
    const { data } = await supabase!.from('settings').select('*');
    if (data) {
      const settingsMap: Record<string, string> = {};
      data.forEach((s: Setting) => {
        settingsMap[s.key_name] = s.val;
      });
      setSettings(settingsMap);
      globalCache.settings = settingsMap;
    }
  };

  const fetchProfile = async () => {
    const { data: { session } } = await supabase!.auth.getSession();
    const user = session?.user;
    
    if (!user) {
      setProfile(null);
      globalCache.profile = null;
      return;
    }

    try {
      const { data, error } = await supabase!.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        globalCache.profile = data;
      } else if (error && error.code === 'PGRST116') {
        const isSuperAdmin = user.email === 'kotadia.ean@gmail.com';
        const { data: newProfile } = await supabase!.from('profiles').insert([{
          id: user.id,
          email: user.email,
          is_super_admin: isSuperAdmin
        }]).select().single();
        
        if (newProfile) {
          setProfile(newProfile);
          globalCache.profile = newProfile;
        }
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }
  };

  const fetchData = async (isInitial = false) => {
    if (!supabase) {
      setError('Supabase credentials missing.');
      setLoading(false);
      return;
    }

    if (isInitial && globalCache.lastFetched && (Date.now() - globalCache.lastFetched < CACHE_EXPIRY)) {
      setLoading(false);
      return;
    }

    try {
      if (isInitial && !globalCache.lastFetched) setLoading(true);
      else setIsRefreshing(true);

      await withRetry(fetchProfile);

      await Promise.all([
        withRetry(fetchCommittees),
        withRetry(fetchMembers),
        withRetry(fetchRankings),
        withRetry(fetchSponsors),
        withRetry(fetchSchedule),
        withRetry(fetchSettings)
      ]);
      
      globalCache.lastFetched = Date.now();
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      if (!err.message?.includes('lock')) {
        setError(err.message || 'An error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    
    fetchData(true);

    const committeesSub = supabase.channel('committees-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'committees' }, fetchCommittees)
      .subscribe();

    const membersSub = supabase.channel('members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers)
      .subscribe();

    const rankingsSub = supabase.channel('rankings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rankings' }, fetchRankings)
      .subscribe();

    const sponsorsSub = supabase.channel('sponsors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sponsors' }, fetchSponsors)
      .subscribe();

    const scheduleSub = supabase.channel('schedule-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, fetchSchedule)
      .subscribe();

    const settingsSub = supabase.channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchSettings)
      .subscribe();

    const profileSub = supabase.channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchProfile)
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(committeesSub);
        supabase.removeChannel(membersSub);
        supabase.removeChannel(rankingsSub);
        supabase.removeChannel(sponsorsSub);
        supabase.removeChannel(scheduleSub);
        supabase.removeChannel(settingsSub);
        supabase.removeChannel(profileSub);
      }
    };
  }, []);

  const refresh = React.useCallback(() => fetchData(false), []);

  return {
    committees,
    members,
    rankings,
    sponsors,
    schedule,
    settings,
    profile,
    loading,
    isRefreshing,
    error,
    refresh
  };
}
