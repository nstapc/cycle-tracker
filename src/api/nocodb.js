const API_BASE = import.meta.env.VITE_NOCODB_BASE_URL;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'xc-token': API_TOKEN,
};

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchWorkouts() {
  const data = await apiFetch('/api/v2/tables/workouts/records');
  return data.list;
}

export async function addWorkout(record) {
  return apiFetch('/api/v2/tables/workouts/records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

export async function fetchPRs() {
  const data = await apiFetch('/api/v2/tables/prs/records');
  return data.list;
}

export async function addPR(record) {
  return apiFetch('/api/v2/tables/prs/records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

export async function fetchProgress() {
  const data = await apiFetch('/api/v2/tables/progress/records');
  return data.list;
}
