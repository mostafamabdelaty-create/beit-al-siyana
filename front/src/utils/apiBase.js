const rawApiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

export const API_ORIGIN = rawApiBase || '';
export const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';

export const toApiUrl = (endpoint = '') => {
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${normalized}`;
};

export const toMediaUrl = (mediaPath = '') => {
  if (!mediaPath) return '';
  if (/^https?:\/\//i.test(mediaPath)) return mediaPath;

  const normalized = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  if (!API_ORIGIN) return normalized;

  return `${API_ORIGIN}${normalized}`;
};
