// --- Класс для работы с API и CDN ---
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export class Api {
    public cdnUrl: string;
    public apiUrl: string;
    private defaultOptions: RequestInit;

    constructor(
        cdnUrl: string,
        apiUrl: string,
        defaultOptions: RequestInit = {}
    ) {
        this.cdnUrl = cdnUrl;
        this.apiUrl = apiUrl;
        this.defaultOptions = defaultOptions;
    }

    getCdnUrl(): string {
        return this.cdnUrl;
    }

    private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
        const res = await fetch(this.apiUrl + url, {
            ...this.defaultOptions,
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(this.defaultOptions.headers as object),
                ...(options.headers as object),
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `Ошибка: ${res.status}`);
        }

        return res.json() as Promise<T>;
    }

    get<T>(url: string): Promise<T> {
        return this.request<T>(url, { method: 'GET' });
    }

    post<T>(
        url: string,
        body: object,
        method: ApiPostMethods = 'POST'
    ): Promise<T> {
        return this.request<T>(url, {
            method,
            body: JSON.stringify(body),
        });
    }
}