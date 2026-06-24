import { Platform } from 'react-native';

const BASE_URL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8001'
  : 'http://localhost:8001';

export const API_URL = BASE_URL;

export async function fetchTasks(search = '', priority = '', category = '', project_id = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (priority) params.append('priority', priority);
  if (category) params.append('category', category);
  if (project_id) params.append('project_id', project_id);

  const res = await fetch(`${API_URL}/api/tasks?${params}`);
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_URL}/api/tasks/stats`);
  return res.json();
}
