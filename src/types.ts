export type CommitteeType = 'conventional' | 'specialized';

export type Committee = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  bg_guide_url: string | null;
  sort_order: number;
  type?: CommitteeType;
  category_type?: 'sport' | 'cultural'; // Backward compatibility
  icon?: string | null;
  gender?: string | null;
  eligible_years?: string | null;
  team_size?: string;
  duration?: string;
  special_rules?: string | null;
  judging_criteria?: { criterion: string; weight: string }[];
  created_at?: string;
};

export type MemberCategory = 'Secretariat' | 'EB' | 'Director' | 'OC';

export type Member = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  committee_id: string | null;
  category: MemberCategory;
  sort_order: number;
  created_at?: string;
  committee?: Committee;
};

export type Ranking = {
  id: number;
  committee_id: string | null;
  name: string;
  school: string;
  award: string;
  created_at?: string;
  committee?: Committee;
};

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type Session = {
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
  house_ids?: string | null; // Backward compatibility
  created_at?: string;
};

export type Setting = {
  key_name: string;
  val: string;
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

export type House = {
  id: string;
  name: string;
  points: number;
  logo_url?: string;
  color?: string;
  mascot?: string | null;
  mascot_name?: string | null;
  motto?: string | null;
};

// Aliases
export type Category = Committee;
export type Match = any;
export type CulturalResult = Ranking;
export type ScheduleItem = Session;
export type GalleryItem = any;
