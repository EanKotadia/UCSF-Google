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

  const safeFetch = async (table: string, orderCol = 'id', ascending = true) => {
    try {
      const { data, error } = await supabase!.from(table).select('*').order(orderCol, { ascending });
      if (error) {
         if (error.code === 'PGRST205') return null; // Table missing
         throw error;
      }
      return data;
    } catch (e) {
      console.warn(`Error fetching ${table}:`, e);
      return null;
    }
  };

  const fetchData = async (isInitial = false) => {
    if (!supabase) {
      setError('Supabase credentials missing.');
      setLoading(false);
      return;
    }
    try {
      if (isInitial && !globalCache.lastFetched) setLoading(true);
      else setIsRefreshing(true);

      const [h, m, s, sett, c, g, n, cr, sc] = await Promise.all([
        safeFetch('houses', 'rank_pos', true),
        safeFetch('matches', 'id', true),
        safeFetch('schedule', 'sort_order', true),
        safeFetch('settings', 'key_name', true),
        safeFetch('categories', 'sort_order', true),
        safeFetch('gallery', 'created_at', false),
        safeFetch('notices', 'created_at', false),
        safeFetch('cultural_results', 'id', true),
        safeFetch('staged_changes', 'created_at', false)
      ]);

      if (h) setHouses(h);
      if (m) setMatches(m);
      if (s) setSchedule(s);
      if (sett) {
        const map: any = {};
        sett.forEach((x: any) => map[x.key_name] = x.val);
        setSettings(map);
      }
      if (c) setCategories(c);
      if (g) setGallery(g);
      if (n) setNotices(n);
      if (cr) setCulturalResults(cr);
      if (sc) setStagedChanges(sc);

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
