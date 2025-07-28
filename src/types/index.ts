export interface Film {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export interface FilmsResponse {
  total: number;
  items: Film[];
}

export interface Shedule {
  daytime: string; // ISO date-time string
  hall: string;
  rows: number;
  seats: number;
  price: number;
}

export interface Ticket {
  film: string; // uuid
  daytime: string; // ISO date-time string
  row: number;
  seat: number;
  price: number;
}
