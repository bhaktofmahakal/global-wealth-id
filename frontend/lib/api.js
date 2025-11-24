export const getBackendUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const convertScore = async (data) => {
  const response = await fetch(`${getBackendUrl()}/api/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Conversion failed');
  return response.json();
};

export const getRecent = async () => {
  const response = await fetch(`${getBackendUrl()}/api/recent`);
  if (!response.ok) throw new Error('Failed to fetch recent');
  return response.json();
};
