
export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  group?: string;
  tableId?: string;
  plusOne?: boolean;
  dietaryRestrictions?: string;
  rsvpStatus?: 'pending' | 'confirmed' | 'declined';
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: 'round' | 'rectangle' | 'square';
  guests: Guest[];
  position: {
    x: number;
    y: number;
  };
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue?: string;
  tables: Table[];
  guests: Guest[];
}
