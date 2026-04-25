import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { House, Match, ScheduleItem, Setting, Category, GalleryItem, Notice, CulturalResult, StagedChange, Profile } from '../types';

// Global cache to persist data across component remounts
const globalCache: Record<string, any> = {
  houses: null,
  matches: null,
  schedule: null,
  settings: null,
  categories: null,
  gallery: null,
  notices: null,
  culturalResults: null,
  stagedChanges: null,
  profile: null,
  lastFetched: 0
};

const CACHE_EXPIRY = 5 * 60 * 1000;

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

export function useAdminData() {
  const [houses, setHouses] = useState<House[]>(globalCache.houses || []);
  const [matches, setMatches] = useState<Match[]>(globalCache.matches || []);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(globalCache.schedule || []);
  const [settings, setSettings] = useState<Record<string, string>>(globalCache.settings || {});
  const [categories, setCategories] = useState<Category[]>(globalCache.categories || []);
  const [gallery, setGallery] = useState<GalleryItem[]>(globalCache.gallery || []);
  const [notices, setNotices] = useState<Notice[]>(globalCache.notices || []);
  const [culturalResults, setCulturalResults] = useState<CulturalResult[]>(globalCache.culturalResults || []);
  const [stagedChanges, setStagedChanges] = useState<StagedChange[]>(globalCache.stagedChanges || []);
  const [profile, setProfile] = useState<Profile | null>(globalCache.profile || null);
  const [loading, setLoading] = useState(!globalCache.lastFetched);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (isInitial = false) => {
    if (!supabase) {
      setError('Supabase credentials missing.');
      setLoading(false);
      return;
    }
    try {
      if (isInitial && !globalCache.lastFetched) setLoading(true);
      else setIsRefreshing(true);

      const [h, m, s, sett, c, g, n, cr, sc, p] = await Promise.all([
        supabase.from('houses').select('*'),
        supabase.from('matches').select('*'),
        supabase.from('schedule').select('*'),
        supabase.from('settings').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('gallery').select('*'),
        supabase.from('notices').select('*'),
        supabase.from('cultural_results').select('*'),
        supabase.from('staged_changes').select('*'),
        supabase.auth.getSession()
      ]);

      if (h.data) setHouses(h.data);
      if (m.data) setMatches(m.data);
      if (s.data) setSchedule(s.data);
      if (sett.data) {
        const map: any = {};
        sett.data.forEach((x: any) => map[x.key_name] = x.val);
        setSettings(map);
      }
      if (c.data) setCategories(c.data);
      if (g.data) setGallery(g.data);
      if (n.data) setNotices(n.data);
      if (cr.data) setCulturalResults(cr.data);
      if (sc.data) setStagedChanges(sc.data);

      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData(true);
  }, []);

  return { houses, matches, schedule, settings, categories, gallery, notices, culturalResults, stagedChanges, profile, loading, isRefreshing, error, refresh: () => fetchData(false) };
}
