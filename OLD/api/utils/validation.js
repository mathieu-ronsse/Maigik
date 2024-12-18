export function validateImageUrl(url) {
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

export function validateReplicateResponse(output) {
  if (!output) {
    throw new Error('No output received from Replicate API');
  }

  if (typeof output !== 'string') {
    throw new Error('Invalid output format from Replicate API');
  }

  try {
    new URL(output);
  } catch {
    throw new Error('Invalid output URL from Replicate API');
  }

  return true;
}