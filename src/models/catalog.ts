import { Api } from '../components/base/api';
import { Film, FilmsResponse, Shedule, Ticket } from '../types';

export class Catalog {
  constructor(protected api: Api) {}

  async getFilms(): Promise<Film[]> {
    const response = await this.api.get<FilmsResponse>('/films');
    return response.items;
  }

  async getShedule(filmId: string): Promise<Shedule[]> {
    const response = await this.api.get<{ total: number; items: Shedule[] }>(`/films/${filmId}/shedule`);
    return response.items;
  }

  async orderTickets(
    total: number,
    tickets: Ticket[]
  ): Promise<{ total: number; tickets: (Ticket & { id: string })[] }> {
    return this.api.post('/order', { total, tickets });
  }
}
