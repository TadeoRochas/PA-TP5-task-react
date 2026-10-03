const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => fetch(`${API_URL}/tasks`).then(handleResponse),
  create: (task) =>
    fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handleResponse),
  update: (id, task) =>
    fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handleResponse),
  remove: (id) => fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' }).then(handleResponse),
  finalize: (id) =>
    fetch(`${API_URL}/tasks/${id}/finalizar`, { method: 'PATCH' }).then(handleResponse),
};
