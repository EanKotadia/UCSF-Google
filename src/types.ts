export type Committee = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  bg_guide_url: string | null;
  sort_order: number;
};

export type MemberCategory = 'Navigator' | "Charge d'Affaires" | 'Director' | 'EB' | 'OC';

export type Member = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  committee_id: string | null;
  category: string;
  sort_order: number;
  committee?: Committee;
};

export type Ranking = {
  id: number;
  committee_id: string;
  name: string;
  school: string;
  award: string;
  committee?: Committee;
};

export type SponsorTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Partner';

export type Sponsor = {
  id: number;
  name: string;
  logo_url: string | null;
  tier: string;
  website_url: string | null;
  sort_order: number;
};

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type ScheduleItem = {
  id: number;
  day_label: string;
  day_date: string;
  time_start: string;
  time_end: string | null;
  title: string;
  subtitle: string | null;
  venue: string | null;
  status: MatchStatus;
  sort_order: number;
};

export type Setting = {
  key_name: string;
  val: string;
};

export type Profile = {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
};
