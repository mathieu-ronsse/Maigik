export async function validateImageUrl(url) {
  if (!url) {
    throw new Error('Image URL is required');
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new Error('Image URL is not accessible');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('URL does not point to a valid image');
    }

    return true;
  } catch (error) {
    console.error('Image validation failed:', error);
    throw new Error('Invalid or inaccessible image URL');
  }
}