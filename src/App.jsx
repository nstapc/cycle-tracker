import { useState, useEffect } from 'react'
import { api } from './api/nocodb'
import WorkoutLog from './components/WorkoutLog'
import PRTracker from './components/PRTracker'
import ProgressChart from './components/ProgressChart'
import './App.css'

// Demo data for local development (used when NocoDB is not configured)
const DEMO_SESSIONS = [
  { id: 1, date: '2026-03-01', type: 'Sprint', duration: 75, distance: 18.5, avg_power: 285, avg_hr: 168, notes: 'Flying 200m practice - felt fast today' },
  { id: 2, date: '2026-03-03', type: 'Endurance', duration: 120, distance: 65.2, avg_power: 195, avg_hr: 142, notes: 'Steady aerobic base ride' },
  { id: 3, date: '2026-03-05', type: 'Interval', duration: 60, distance: 22.0, avg_power: 310, avg_hr: 175, notes: '6x 500m efforts with 5min rest' },
  { id: 4, date: '2026-03-08', type: 'Track', duration: 90, distance: 35.0, avg_power: 270, avg_hr: 162, notes: 'Track session - standing starts and pursuits' },
  { id: 5, date: '2026-03-10', type: 'Recovery', duration: 45, distance: 15.0, avg_power: 145, avg_hr: 125, notes: 'Easy spin, active recovery' },
  { id: 6, date: '2026-03-12', type: 'Sprint', duration: 80, distance: 20.5, avg_power: 295, avg_hr: 170, notes: 'Match sprints - won 3 of 4' },
  { id: 7, date: '2026-03-15', type: 'Endurance', duration: 150, distance: 82.0, avg_power: 188, avg_hr: 140, notes: 'Long road ride for base miles' },
  { id: 8, date: '2026-03-18', type: 'Interval', duration: 55, distance: 19.5, avg_power: 320, avg_hr: 178, notes: 'VO2max intervals - 5x 3min' },
  { id: 9, date: '2026-03-20', type: 'Strength', duration: 60, distance: 0, avg_power: 0, avg_hr: 135, notes: 'Gym session - squats and deadlifts' },
  { id: 10, date: '2026-03-22', type: 'Track', duration: 95, distance: 38.0, avg_power: 280, avg_hr: 165, notes: 'Keirin practice - good positioning' },
]

const DEMO_EFFORTS = [
  { id: 1, session_id: 1, exercise_name: 'Flying 200m', max_power: 1250, time: 11.2, set_number: 1 },
  { id: 2, session_id: 1, exercise_name: 'Flying 200m', max_power: 1280, time: 11.0, set_number: 2 },
  { id: 3, session_id: 3, exercise_name: 'Standing Start 500m', max_power: 1180, time: 34.5, set_number: 1 },
  { id: 4, session_id: 3, exercise_name: 'Standing Start 500m', max_power: 1200, time: 34.2, set_number: 2 },
  { id: 5, session_id: 4, exercise_name: 'Sprint', max_power: 1320, set_number: 1 },
  { id: 6, session_id: 4, exercise_name: 'Standing Start 250m', max_power: 1150, time: 19.8, set_number: 1 },
  { id: 7, session_id: 6, exercise_name: 'Sprint', max_power: 1350, set_number: 1 },
  { id: 8, session_id: 6, exercise_name: 'Sprint', max_power: 1290, set_number: 2 },
  { id: 9, session_id: 8, exercise_name: 'Tempo Effort', avg_power: 340, set_number: 1 },
  { id: 10, session_id: 10, exercise_name: 'Flying 200m', max_power: 1300, time: 10.9, set_number: 1 },
]

export default function App() {
  const [sessions, setSessions] = useState([])
  const [efforts, setEfforts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('log')
  const [useDemo, setUseDemo] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
    
    try {
      // Try to fetch from NocoDB
      const [sessionsData, effortsData] = await Promise.all([
        api.getSessions(),
        api.getAllEfforts()
      ])
      
      setSessions(sessionsData?.list ?? sessionsData ?? [])
      setEfforts(effortsData?.list ?? effortsData ?? [])
      setUseDemo(false)
    } catch (err) {
      console.log('NocoDB not available, using demo data:', err.message)
      // Fall back to demo data
      setSessions(DEMO_SESSIONS)
      setEfforts(DEMO_EFFORTS)
      setUseDemo(true)
      setError('Running with demo data. Connect NocoDB to save your real training data.')
    } finally {
      setLoading(false)
    }
  }

  function handleSessionAdded(session) {
    // In demo mode, just add to local state
    if (useDemo) {
      setSessions(prev => [{ ...session, id: Date.now() }, ...prev])
    }
    // In production, you'd call api.addSession(session) and refresh
  }

  if (loading) {
    return (
      <div className="cycle-app">
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚴 Loading Cycle Tracker...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="cycle-app">
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>🚴 Cycle Tracker</h1>
          <p style={{ color: 'var(--text, #6b6375)', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Track your track cycling training, PRs, and progress
          </p>
        </div>
        {useDemo && (
          <button
            onClick={loadData}
            style={{
              padding: '0.375rem 0.75rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Retry NocoDB Connection
          </button>
        )}
      </header>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#92400e'
        }}>
          {error}
        </div>
      )}

      <nav style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border, #e5e4e7)',
        paddingBottom: '1rem'
      }}>
        {[
          { key: 'log', label: '📋 Sessions', desc: 'Log & view training' },
          { key: 'prs', label: '🏆 PRs', desc: 'Personal records' },
          { key: 'progress', label: '📈 Progress', desc: 'Charts & trends' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: tab === t.key ? '#4f46e5' : 'transparent',
              color: tab === t.key ? 'white' : 'var(--text, #6b6375)',
              border: tab === t.key ? 'none' : '1px solid var(--border, #e5e4e7)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: '0.95rem',
              transition: 'all 0.15s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'log' && <WorkoutLog sessions={sessions} onSessionAdded={handleSessionAdded} />}
        {tab === 'prs' && <PRTracker efforts={efforts} sessions={sessions} />}
        {tab === 'progress' && <ProgressChart sessions={sessions} efforts={efforts} />}
      </main>

      <footer style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border, #e5e4e7)',
        textAlign: 'center',
        color: 'var(--text, #6b6375)',
        fontSize: '0.8rem'
      }}>
        <p>
          Cycle Tracker &middot; Built with React + NocoDB &middot;{' '}
          <a href="https://github.com" style={{ color: '#4f46e5' }}>View on GitHub</a>
        </p>
      </footer>
    </div>
  )
}
