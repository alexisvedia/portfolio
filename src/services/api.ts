import { useUser } from '../context/UserContext';

export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const useApi = () => {
  const { token } = useUser();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const getAiPages = async () => {
    const resp = await fetch(`${API_BASE}/ai`, { headers });
    if (!resp.ok) throw new Error('Failed to fetch');
    return resp.json();
  };

  const searchAiPages = async (q: string) => {
    const params = new URLSearchParams({ q });
    const resp = await fetch(`${API_BASE}/search?${params.toString()}`, { headers });
    if (!resp.ok) throw new Error('Search failed');
    return resp.json();
  };

  const addFavorite = async (id: number) => {
    const resp = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ai_page_id: id }),
    });
    if (!resp.ok) throw new Error('Failed');
    return resp.json();
  };

  const getFavorites = async () => {
    const resp = await fetch(`${API_BASE}/favorites`, { headers });
    if (!resp.ok) throw new Error('Failed');
    return resp.json();
  };

  return { getAiPages, searchAiPages, addFavorite, getFavorites };
};
