const API_BASE = import.meta.env.VITE_NOCODB_BASE_URL;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'xc-token': API_TOKEN,
};

export async function fetchWorkouts() {
  const res = await fetch(`${API_BASE}/api/v2/tables/workouts/records`, {
    headers,
  });
  const data = await res.json();
  return data.list;
}

export async function addWorkout(record) {
  const res = await fetch(`${API_BASE}/api/v2/tables/workouts/records`, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  return res.json();
}

export async function fetchPRs() {
  const res = await fetch(`${API_BASE}/api/v2/tables/prs/records`, {
    headers,
  });
  const data = await res.json();
  return data.list;
}

export async function addPR(record) {
  const res = await fetch(`${API_BASE}/api/v2/tables/prs/records`, {
    method: 'POST',
    headers,
    body: JSON.stringify(record),
  });
  return res.json();
}

export async function fetchProgress() {
  const res = await fetch(`${API_BASE}/api/v2/tables/progress/records`, {
    headers,
  });
  const data = await res.json();
  return data.list;
}
