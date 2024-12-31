// Convert base64 image to URL if needed
export async function prepareImageUrl(imageData: string): Promise<string> {
  if (!imageData.startsWith('data:')) {
    return imageData;
  }

  // Convert base64 to blob
  const response = await fetch(imageData);
  const blob = await response.blob();

  // Create form data
  const formData = new FormData();
  formData.append('file', blob, 'image.png');

  // Upload to temporary storage
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image');
  }

  const { url } = await uploadResponse.json();
  return url;
}