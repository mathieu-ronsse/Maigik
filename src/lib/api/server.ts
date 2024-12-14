interface ApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface ApiResponse extends Response {
  ok: boolean;
}

export function createServerApi(options: ApiOptions = {}) {
  const baseUrl = options.baseUrl || '/api';
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  return {
    async post(endpoint: string, data: unknown): Promise<ApiResponse> {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(data)
      });

      return response;
    },

    async get(endpoint: string): Promise<ApiResponse> {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: defaultHeaders
      });

      return response;
    }
  };
}