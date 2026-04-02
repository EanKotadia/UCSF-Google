import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { House, Match, ScheduleItem, Setting, Category } from '../types';

export function useUCSFData() {
  const [houses, setHouses] = useState<House[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!supabase) {
      setError('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables in the Secrets panel.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const [
        { data: housesData },
        { data: matchesData },
        { data: scheduleData },
        { data: settingsData },
        { data: categoriesData }
      ] = await Promise.all([
        supabase.from('houses').select('*').order('rank_pos', { ascending: true }),
        supabase.from('matches').select('*, team1:team1_id(*), team2:team2_id(*), category:category_id(*)').order('id', { ascending: true }),
        supabase.from('schedule').select('*').order('sort_order', { ascending: true }),
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*').order('sort_order', { ascending: true })
      ]);

      if (housesData) setHouses(housesData);
      if (matchesData) setMatches(matchesData);
      if (scheduleData) setSchedule(scheduleData);
      if (categoriesData) setCategories(categoriesData);
      
      if (settingsData) {
        const settingsMap: Record<string, string> = {};
        settingsData.forEach((s: Setting) => {
          settingsMap[s.key_name] = s.val;
        });
        setSettings(settingsMap);
      }
    } catch (err: any) {
      console.error('Error fetching UCSF data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    
    fetchData();

    // Real-time subscriptions
    const housesSub = supabase.channel('houses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'houses' }, fetchData)
      .subscribe();

    const matchesSub = supabase.channel('matches-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchData)
      .subscribe();

    const scheduleSub = supabase.channel('schedule-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(housesSub);
      supabase.removeChannel(matchesSub);
      supabase.removeChannel(scheduleSub);
    };
  }, []);

  return { houses, matches, schedule, settings, categories, loading, error, refresh: fetchData };
}
