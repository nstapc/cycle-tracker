import { useState } from 'react'

// Session type options for track cyclists
const SESSION_TYPES = ['Sprint', 'Interval', 'Endurance', 'Recovery', 'Track', 'Strength']

export default function WorkoutLog({ sessions, onSessionAdded }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Sprint',
    duration: '',
    distance: '',
    avg_power: '',
    avg_hr: '',
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // In a real app, this would call api.addSession()
    // For now, we'll just pass the data up for demo purposes
    const session = {
      ...formData,
      duration: Number(formData.duration) || null,
      distance: Number(formData.distance) || null,
      avg_power: Number(formData.avg_power) || null,
      avg_hr: Number(formData.avg_hr) || null,
    }
    
    if (onSessionAdded) {
      onSessionAdded(session)
    }
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Sprint',
      duration: '',
      distance: '',
      avg_power: '',
      avg_hr: '',
      notes: ''
    })
    setShowForm(false)
  }

  const getTypeColor = (type) => {
    const colors = {
      Sprint: '#ef4444',
      Interval: '#f97316',
      Endurance: '#22c55e',
      Recovery: '#3b82f6',
      Track: '#8b5cf6',
      Strength: '#ec4899'
    }
    return colors[type] || '#6b7280'
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Training Sessions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {showForm ? 'Cancel' : '+ Log Session'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          padding: '1.5rem',
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              >
                {SESSION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Duration (min)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="60"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="25.5"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Avg Power (W)</label>
              <input
                type="number"
                value={formData.avg_power}
                onChange={(e) => setFormData({ ...formData, avg_power: e.target.value })}
                placeholder="250"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Avg HR (bpm)</label>
              <input
                type="number"
                value={formData.avg_hr}
                onChange={(e) => setFormData({ ...formData, avg_hr: e.target.value })}
                placeholder="155"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Felt strong on the sprint efforts..."
              rows={2}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)', resize: 'vertical' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Save Session
          </button>
        </form>
      )}

      {sessions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '0.75rem',
          color: 'var(--text, #6b6375)'
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No sessions logged yet</p>
          <p>Click &quot;+ Log Session&quot; to add your first training session, or add data directly in NocoDB.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sessions.map((session, idx) => (
            <div
              key={session.id || idx}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg, #fff)',
                border: '1px solid var(--border, #e5e4e7)',
                borderRadius: '0.75rem',
                textAlign: 'left'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{session.date}</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getTypeColor(session.type),
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  {session.type}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text, #6b6375)', fontSize: '0.95rem' }}>
                {session.duration && <span>{session.duration} min</span>}
                {session.distance && <span>{session.distance} km</span>}
                {session.avg_power && <span>{session.avg_power} W avg</span>}
                {session.avg_hr && <span>{session.avg_hr} bpm</span>}
              </div>
              {session.notes && (
                <p style={{ marginTop: '0.5rem', color: 'var(--text, #6b6375)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  {session.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
