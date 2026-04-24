export type Committee = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  bg_guide_url: string | null;
  sort_order: number;
};

export type MemberCategory = 'Navigator' | "Charge d'Affaires" | 'Director' | 'EB' | 'OC';

export type Member = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  committee_id: string | null;
  category: MemberCategory;
  sort_order: number;
  committee?: Committee;
};

export type RankingAward = 'Best Delegate' | 'High Commendation' | 'Special Mention' | 'Honorable Mention' | 'Best Position Paper';

export type Ranking = {
  id: string;
  committee_id: string;
  delegate_name: string;
  school: string;
  award: RankingAward;
  points: number;
  committee?: Committee;
};

export type ScheduleStatus = 'upcoming' | 'live' | 'completed';

export type ScheduleItem = {
  id: string;
  day_label: string;
  day_date: string;
  time_start: string;
  time_end: string | null;
  title: string;
  subtitle: string | null;
  venue: string | null;
  status: ScheduleStatus;
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
