export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
  readonly baseUrl: string;
  protected options: RequestInit;

  constructor(baseUrl: string, options: RequestInit = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as object ?? {})
      }
    };
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return response.json();
    } else {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? response.statusText ?? `Ошибка: ${response.status}`);
    }
  }

  get<T>(uri: string): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method: 'GET',
    }).then(this.handleResponse);
  }

  post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
    return fetch(this.baseUrl + uri, {
      ...this.options,
      method,
      body: JSON.stringify(data),
    }).then(this.handleResponse);
  }
}
