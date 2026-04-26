import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { House, Match, ScheduleItem, Setting, Category, GalleryItem, Notice, CulturalResult, StagedChange, Profile } from '../types';
import { HARDCODED_CATEGORIES } from '../constants/hardcodedData';

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

export function useUCSFData() {
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

    if (isInitial && globalCache.lastFetched && (Date.now() - globalCache.lastFetched < CACHE_EXPIRY)) {
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

      if (h) { setHouses(h); globalCache.houses = h; }
      if (m) { setMatches(m); globalCache.matches = m; }
      if (s) { setSchedule(s); globalCache.schedule = s; }
      if (sett) {
        const map: Record<string, string> = {};
        sett.forEach((x: any) => map[x.key_name] = x.val);
        setSettings(map);
        globalCache.settings = map;
      }
      if (c) {
        const mergedCategories = c.map((cat: Category) => {
          const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const hardcoded = HARDCODED_CATEGORIES[slug] || HARDCODED_CATEGORIES[cat.name.toLowerCase()];
          if (hardcoded) {
            return {
              ...cat,
              ...hardcoded,
              category_type: cat.category_type || hardcoded.category_type,
              team_size: cat.team_size || hardcoded.team_size,
              duration: cat.duration || hardcoded.duration,
              special_rules: cat.special_rules || hardcoded.special_rules,
              judging_criteria: (cat.judging_criteria && cat.judging_criteria.length > 0) ? cat.judging_criteria : hardcoded.judging_criteria,
            } as Category;
          }
          return cat;
        });
        setCategories(mergedCategories);
        globalCache.categories = mergedCategories;
      }
      if (g) { setGallery(g); globalCache.gallery = g; }
      if (n) { setNotices(n); globalCache.notices = n; }
      if (cr) { setCulturalResults(cr); globalCache.culturalResults = cr; }
      if (sc) { setStagedChanges(sc); globalCache.stagedChanges = sc; }

      globalCache.lastFetched = Date.now();
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
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

  return { houses, matches, schedule, settings, categories, gallery, notices, culturalResults, stagedChanges, profile, loading, isRefreshing, error, refresh };
}
