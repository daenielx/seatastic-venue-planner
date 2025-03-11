
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  group_name?: string;
  table_id?: string;
  plus_one?: boolean;
  dietary_restrictions?: string;
  rsvp_status?: 'pending' | 'confirmed' | 'declined';
  event_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangle' | 'square';
  position_x: number;
  position_y: number;
  event_id: string;
  created_at?: string;
  updated_at?: string;
  guests?: Guest[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthSession = {
  user: {
    id: string;
    email?: string;
  } | null;
  isLoading: boolean;
}
