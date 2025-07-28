export class Api {
  constructor(private baseUrl: string) {}

  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(this.baseUrl + url, options);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка: ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  get<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  post<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
