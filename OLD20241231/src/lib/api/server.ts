const API_BASE = '/.netlify/functions';

interface ApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface ApiResponse extends Response {
  ok: boolean;
}

export function createServerApi(options: ApiOptions = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  return {
    async post(endpoint: string, data: unknown): Promise<ApiResponse> {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data)
      });

      return response;
    },

    async get(endpoint: string): Promise<ApiResponse> {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: defaultHeaders
      });

      return response;
    }
  };
}