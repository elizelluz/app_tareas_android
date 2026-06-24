import { API_URL } from './tasks';

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/api/projects`);
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(id, data) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
  return res.json();
}
