const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    params?: Record<string, string | number>,
    body?: unknown,
  ): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    return response.json() as Promise<T>;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number>,
  ): Promise<T> {
    return this.request<T>("GET", endpoint, params);
  }

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, undefined, body);
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, undefined, body);
  }

  async del<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export { ApiError, ApiClient };
export const apiClient = new ApiClient(API_BASE_URL);
