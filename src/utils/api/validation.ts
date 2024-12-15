export function validateImageUrl(url: string): boolean {
  if (!url) {
    throw new Error('Image URL is required');
  }

  try {
    new URL(url);
    return true;
  } catch {
    throw new Error('Invalid image URL format');
  }
}

export function validateApiResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new Error(response.error);
  }

  if (!response.data) {
    throw new Error('Invalid API response: missing data');
  }

  return response.data;
}