import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Committee, Member, Ranking, Session, Setting, Notice, StagedChange, Profile, House } from '../types';

// Global cache to persist data across component remounts
const globalCache: Record<string, any> = {
  committees: null,
  members: null,
  rankings: null,
  schedule: null,
  settings: null,
  notices: null,
  stagedChanges: null,
  profile: null,
  houses: null,
  lastFetched: 0
};

const CACHE_EXPIRY = 5 * 60 * 1000;

const MOCK_COMMITTEES: Committee[] = [
  { id: '1', name: 'UN Security Council', slug: 'unsc', description: 'Maintains international peace and security.', image_url: null, bg_guide_url: null, sort_order: 1, type: 'conventional' },
  { id: '2', name: 'DISEC', slug: 'disec', description: 'Disarmament and International Security Committee.', image_url: null, bg_guide_url: null, sort_order: 2, type: 'conventional' }
];

const MOCK_HOUSES: House[] = [
  { id: '1', name: 'Maple', points: 120 },
  { id: '2', name: 'Cedar', points: 100 }
];

const MOCK_SCHEDULE: Session[] = [
  { id: 1, title: 'Opening Ceremony', day_label: 'Day 1', day_date: 'Oct 24', time_start: '09:00', status: 'upcoming', sort_order: 1, venue: 'Auditorium', subtitle: 'Welcome to Harmonia MUN 2026', time_end: '10:30' }
];

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

export function useHarmoniaMUNData() {
  const [committees, setCommittees] = useState<Committee[]>(globalCache.committees || []);
  const [members, setMembers] = useState<Member[]>(globalCache.members || []);
  const [rankings, setRankings] = useState<Ranking[]>(globalCache.rankings || []);
  const [schedule, setSchedule] = useState<Session[]>(globalCache.schedule || []);
  const [settings, setSettings] = useState<Record<string, string>>(globalCache.settings || {});
  const [notices, setNotices] = useState<Notice[]>(globalCache.notices || []);
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>(globalCache.stagedChanges || []);
  const [profile, setProfile] = useState<Profile | null>(globalCache.profile || null);
  const [houses, setHouses] = useState<House[]>(globalCache.houses || []);
  const [loading, setLoading] = useState(!globalCache.lastFetched);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCommittees = async () => {
    const { data } = await supabase!.from('committees').select('*').order('sort_order', { ascending: true });
    if (data) {
      setCommittees(data.length > 0 ? data : MOCK_COMMITTEES);
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

  const fetchSchedule = async () => {
    const { data } = await supabase!.from('schedule').select('*').order('sort_order', { ascending: true });
    if (data) {
      setSchedule(data.length > 0 ? data : MOCK_SCHEDULE);
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

  const fetchNotices = async () => {
    const { data } = await supabase!.from('notices').select('*').order('created_at', { ascending: false });
    if (data) {
      setNotices(data);
      globalCache.notices = data;
    }
  };

  const fetchStagedChanges = async () => {
    const { data } = await supabase!.from('staged_changes').select('*').order('created_at', { ascending: false });
    if (data) {
      setStagedChanges(data);
      globalCache.stagedChanges = data;
    }
  };

  const fetchHouses = async () => {
    const { data } = await supabase!.from('houses').select('*').order('points', { ascending: false });
    if (data) {
      setHouses(data.length > 0 ? data : MOCK_HOUSES);
      globalCache.houses = data;
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
        withRetry(fetchSchedule),
        withRetry(fetchSettings),
        withRetry(fetchNotices),
        withRetry(fetchStagedChanges),
        withRetry(fetchHouses)
      ]);

      globalCache.lastFetched = Date.now();
      setError(null);
    } catch (err: any) {
      console.error('Error fetching MUN data:', err);
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    fetchData(true);
  }, []);

  const refresh = React.useCallback(() => fetchData(false), []);

  return { committees, members, rankings, schedule, settings, notices, stagedChanges, profile, houses, loading, isRefreshing, error, refresh };
}
