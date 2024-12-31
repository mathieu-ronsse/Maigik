export async function handleReplicateResponse(response) {
  try {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format from Replicate API');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to handle Replicate response:', error);
    throw error;
  }
}