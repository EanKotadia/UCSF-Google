export type House = {
  id: string;
  name: string;
  color: string;
  mascot: string | null;
  mascot_name: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  points: number;
  sports_points: number;
  cultural_points: number;
  rank_pos: number;
  motto: string | null;
};

export type Category = {
  id: string;
  name: string;
  icon: string | null;
  sort_order: number;
  gender: string | null;
  eligible_years: string | null;
  category_type: 'sport' | 'cultural';
  special_rules?: string | null;
  is_active?: boolean;
  registration_url?: string | null;
  team_size?: string;
  duration?: string;
  image_url?: string | null;
  bg_guide_url?: string | null;
  oc_members?: string | null;
  judging_criteria?: { criterion: string; weight: string }[];
};

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type Match = {
  id: number;
  category_id: string;
  match_no: number;
  team1_id: string;
  team2_id: string;
  score1: number | null;
  score2: number | null;
  winner_id: string | null;
  status: MatchStatus;
  venue: string | null;
  match_time: string | null;
  eligible_years: string | null;
  man_of_the_match?: string | null;
  category?: Category;
  team1?: House;
  team2?: House;
  winner?: House;
};

export type CulturalResult = {
  id: number;
  category_id: string;
  house_id: string;
  rank: number | null;
  points: number | null;
  comments?: string | null;
  category?: Category;
  house?: House;
};

export type ScheduleItem = {
  id: number;
  day_label: string;
  day_date: string;
  time_start: string;
  time_end: string | null;
  title: string;
  subtitle: string | null;
  category: string | null;
  venue: string | null;
  house_ids: string | null;
  status: MatchStatus;
  sort_order: number;
};

export type Setting = {
  key_name: string;
  val: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  year?: number;
  created_at: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
};

export type StagedChange = {
  id: number;
  table_name: string;
  record_id: string;
  updates: any;
  created_by: string;
  created_by_email: string;
  status: 'pending' | 'approved' | 'discarded';
  created_at: string;
};
