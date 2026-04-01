// NocoDB API Layer
// All API calls for the cycle tracker are centralized here

const BASE = import.meta.env.VITE_NOCODB_URL
const TOKEN = import.meta.env.VITE_NOCODB_TOKEN

const headers = {
  'xc-auth': TOKEN,
  'Content-Type': 'application/json',
}

// Helper function for API responses
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

// Replace these with your actual NocoDB project and table IDs after setup
// You can find these in the NocoDB URL when viewing a table
const PROJECT_ID = 'cycle-tracker'
const SESSIONS_TABLE = 'sessions'       // Cycling sessions (date, type, duration, notes)
const EXERCISES_TABLE = 'exercises'     // Exercise types (sprints, intervals, endurance, etc.)
const EFFORTS_TABLE = 'efforts'         // Individual efforts/sets within a session

export const api = {
  // ---- Sessions ----
  getSessions: () =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${SESSIONS_TABLE}?sort=-date`, { headers })
      .then(handleResponse),

  getSession: (id) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${SESSIONS_TABLE}/${id}`, { headers })
      .then(handleResponse),

  addSession: (data) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${SESSIONS_TABLE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateSession: (id, data) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${SESSIONS_TABLE}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteSession: (id) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${SESSIONS_TABLE}/${id}`, {
      method: 'DELETE',
      headers
    }).then(handleResponse),

  // ---- Exercises ----
  getExercises: () =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EXERCISES_TABLE}`, { headers })
      .then(handleResponse),

  addExercise: (data) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EXERCISES_TABLE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  // ---- Efforts (individual sets/efforts within a session) ----
  getEfforts: (sessionId) =>
    fetch(
      `${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}?where=(session_id,eq,${sessionId})`,
      { headers }
    ).then(handleResponse),

  getAllEfforts: () =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}`, { headers })
      .then(handleResponse),

  addEffort: (data) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateEffort: (id, data) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    }).then(handleResponse),

  deleteEffort: (id) =>
    fetch(`${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}/${id}`, {
      method: 'DELETE',
      headers
    }).then(handleResponse),

  // ---- PR (Personal Record) Queries ----
  // Get max power/speed for a given exercise type
  getPRs: () =>
    fetch(
      `${BASE}/api/v1/db/data/noco/${PROJECT_ID}/${EFFORTS_TABLE}?sort=-max_power`,
      { headers }
    ).then(handleResponse),
}

// NocoDB table schemas to create in your NocoDB instance:
//
// SESSIONS table:
//   - id (auto)
//   - date (Date)
//   - type (SingleSelect: 'Sprint', 'Interval', 'Endurance', 'Recovery', 'Track')
//   - duration (Number - minutes)
//   - distance (Number - km)
//   - avg_power (Number - watts)
//   - avg_hr (Number - bpm)
//   - notes (Text)
//   - created_at (auto)
//
// EXERCISES table:
//   - id (auto)
//   - name (Text: 'Flying 200m', 'Standing Start', 'Pursuit', 'Sprint', etc.)
//   - category (SingleSelect: 'Sprint', 'Endurance', 'Strength')
//   - description (LongText)
//
// EFFORTS table:
//   - id (auto)
//   - session_id (LinkToAnotherRecord -> sessions)
//   - exercise_id (LinkToAnotherRecord -> exercises)
//   - set_number (Number)
//   - max_power (Number - watts)
//   - avg_power (Number - watts)
//   - max_speed (Number - km/h)
//   - avg_speed (Number - km/h)
//   - time (Number - seconds for timed efforts)
//   - distance (Number - meters)
//   - reps (Number)
//   - notes (Text)
