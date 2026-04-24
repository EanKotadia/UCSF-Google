import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Committee,
  Member,
  Ranking,
  ScheduleItem,
  Setting,
  Profile
} from '../types';

const globalCache: Record<string, any> = {
  committees: null,
  members: null,
  rankings: null,
  schedule: null,
  settings: null,
  profile: null,
  lastFetched: 0
};

const MOCK_COMMITTEES: Committee[] = [
  { id: '1', name: 'UN Security Council', description: 'Maintaining international peace and security.', bg_guide_url: '#', sort_order: 1, image_url: null },
  { id: '2', name: 'DISEC', description: 'Disarmament and International Security Committee.', bg_guide_url: '#', sort_order: 2, image_url: null },
  { id: '3', name: 'UNHRC', description: 'United Nations Human Rights Council.', bg_guide_url: '#', sort_order: 3, image_url: null }
];

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Arav Sharma', role: 'Director', category: 'Director', committee_id: '1', sort_order: 1, bio: null, image_url: null },
  { id: '2', name: 'Ishita Gupta', role: 'Navigator', category: 'Navigator', committee_id: null, sort_order: 2, bio: null, image_url: null },
  { id: '3', name: 'Aditya Raj', role: 'Charge d\'Affaires', category: 'Charge d\'Affaires', committee_id: null, sort_order: 3, bio: null, image_url: null }
];

const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: '1', title: 'Opening Ceremony', day_label: 'Day 1', day_date: 'Oct 24', time_start: '09:00', time_end: '10:30', venue: 'Main Auditorium', status: 'upcoming', sort_order: 1, subtitle: null },
  { id: '2', title: 'Committee Session I', day_label: 'Day 1', day_date: 'Oct 24', time_start: '11:00', time_end: '13:30', venue: 'Committee Rooms', status: 'upcoming', sort_order: 2, subtitle: null }
];

const CACHE_EXPIRY = 5 * 60 * 1000;

export function useUCSFData() {
  const [committees, setCommittees] = useState<Committee[]>(globalCache.committees || []);
  const [members, setMembers] = useState<Member[]>(globalCache.members || []);
  const [rankings, setRankings] = useState<Ranking[]>(globalCache.rankings || []);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(globalCache.schedule || []);
  const [settings, setSettings] = useState<Record<string, string>>(globalCache.settings || {});
  const [profile, setProfile] = useState<Profile | null>(globalCache.profile || null);
  const [loading, setLoading] = useState(!globalCache.lastFetched);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!supabase) return;
    try {
      const [
        { data: cData },
        { data: mData },
        { data: rData },
        { data: sData },
        { data: setData }
      ] = await Promise.all([
        supabase.from('committees').select('*').order('sort_order'),
        supabase.from('members').select('*, committee:committee_id(*)').order('sort_order'),
        supabase.from('rankings').select('*, committee:committee_id(*)').order('points', { ascending: false }),
        supabase.from('schedule').select('*').order('sort_order'),
        supabase.from('settings').select('*')
      ]);

      const committees = cData && cData.length > 0 ? cData : MOCK_COMMITTEES;
      const members = mData && mData.length > 0 ? mData : MOCK_MEMBERS;
      const schedule = sData && sData.length > 0 ? sData : MOCK_SCHEDULE;
      const rankings = rData || [];

      const settingsMap: Record<string, string> = {};
      if (setData) setData.forEach((s: any) => settingsMap[s.key_name || s.key] = s.val || s.value);

      setCommittees(committees);
      setMembers(members);
      setSchedule(schedule);
      setRankings(rankings);
      setSettings(settingsMap);
      
      globalCache.committees = committees;
      globalCache.members = members;
      globalCache.schedule = schedule;
      globalCache.rankings = rankings;
      globalCache.settings = settingsMap;
      globalCache.lastFetched = Date.now();
    } catch (err: any) {
      console.error(err);
      // Fallback to mock data on error if cache is empty
      if (!globalCache.lastFetched) {
        setCommittees(MOCK_COMMITTEES);
        setMembers(MOCK_MEMBERS);
        setSchedule(MOCK_SCHEDULE);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { committees, members, rankings, schedule, settings, profile, loading, error, refresh: fetchData };
}
