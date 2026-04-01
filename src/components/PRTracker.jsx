import { useState, useMemo } from 'react'

// Common track cycling exercises and their key metrics
const TRACK_EXERCISES = [
  { name: 'Flying 200m', metric: 'time', unit: 's', lowerIsBetter: true },
  { name: 'Standing Start 250m', metric: 'time', unit: 's', lowerIsBetter: true },
  { name: 'Standing Start 500m', metric: 'time', unit: 's', lowerIsBetter: true },
  { name: 'Individual Pursuit', metric: 'time', unit: 's', lowerIsBetter: true },
  { name: 'Sprint', metric: 'max_power', unit: 'W', lowerIsBetter: false },
  { name: 'Standing Start Effort', metric: 'max_power', unit: 'W', lowerIsBetter: false },
  { name: 'Endurance Ride', metric: 'distance', unit: 'km', lowerIsBetter: false },
  { name: 'Tempo Effort', metric: 'avg_power', unit: 'W', lowerIsBetter: false },
]

export default function PRTracker({ efforts = [], sessions = [] }) {
  const [selectedExercise, setSelectedExercise] = useState('all')

  // Compute PRs from efforts data
  const prs = useMemo(() => {
    if (!efforts || efforts.length === 0) {
      return []
    }

    // Group efforts by exercise and find best for each
    const grouped = {}
    
    efforts.forEach(effort => {
      const exerciseName = effort.exercise_name || effort.exercise_id || 'Unknown'
      if (!grouped[exerciseName]) {
        grouped[exerciseName] = []
      }
      grouped[exerciseName].push(effort)
    })

    // Find PR for each exercise
    return Object.entries(grouped).map(([exercise, exerciseEfforts]) => {
      // Try to match with known exercises for metric info
      const knownEx = TRACK_EXERCISES.find(e => e.name === exercise)
      const metric = knownEx?.metric || 'max_power'
      const unit = knownEx?.unit || 'W'
      const lowerIsBetter = knownEx?.lowerIsBetter ?? false

      // Find the best effort
      let best = exerciseEfforts[0]
      exerciseEfforts.forEach(effort => {
        const currentVal = effort[metric] || 0
        const bestVal = best[metric] || 0
        if (lowerIsBetter ? (currentVal < bestVal && currentVal > 0) : currentVal > bestVal) {
          best = effort
        }
      })

      return {
        exercise,
        metric,
        unit,
        lowerIsBetter,
        value: best[metric],
        date: best.date || best.created_at || 'N/A',
        totalEfforts: exerciseEfforts.length,
      }
    }).filter(pr => pr.value > 0)
  }, [efforts])

  const filteredPRs = selectedExercise === 'all'
    ? prs
    : prs.filter(pr => pr.exercise === selectedExercise)

  // Compute session-based stats as fallback when no efforts exist
  const sessionStats = useMemo(() => {
    if (!sessions || sessions.length === 0) return null
    
    const maxPower = Math.max(...sessions.map(s => s.avg_power || 0))
    const maxDistance = Math.max(...sessions.map(s => s.distance || 0))
    const maxDuration = Math.max(...sessions.map(s => s.duration || 0))
    const totalSessions = sessions.length
    const totalDistance = sessions.reduce((sum, s) => sum + (s.distance || 0), 0)
    const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

    return {
      maxPower,
      maxDistance,
      maxDuration,
      totalSessions,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalDuration,
    }
  }, [sessions])

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ marginBottom: '1rem' }}>Personal Records</h2>

      {efforts.length === 0 && sessions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '0.75rem',
          color: 'var(--text, #6b6375)'
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No data yet</p>
          <p>Log some training sessions to start tracking your PRs.</p>
        </div>
      ) : (
        <>
          {/* Session-level summary stats */}
          {sessionStats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--code-bg, #f4f3ec)',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444' }}>
                  {sessionStats.totalSessions}
                </div>
                <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.85rem' }}>Sessions</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--code-bg, #f4f3ec)',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316' }}>
                  {sessionStats.totalDistance}
                </div>
                <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.85rem' }}>Total km</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--code-bg, #f4f3ec)',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22c55e' }}>
                  {sessionStats.maxPower || '-'}
                </div>
                <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.85rem' }}>Peak Power (W)</div>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--code-bg, #f4f3ec)',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6' }}>
                  {Math.round(sessionStats.totalDuration / 60 * 10) / 10 || 0}
                </div>
                <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.85rem' }}>Total Hours</div>
              </div>
            </div>
          )}

          {/* Effort-level PRs */}
          {efforts.length > 0 && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>Filter by exercise:</label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
                >
                  <option value="all">All Exercises</option>
                  {prs.map(pr => (
                    <option key={pr.exercise} value={pr.exercise}>{pr.exercise}</option>
                  ))}
                </select>
              </div>

              {filteredPRs.length === 0 ? (
                <p style={{ color: 'var(--text, #6b6375)' }}>No PRs recorded for this exercise yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {filteredPRs.map((pr) => (
                    <div
                      key={pr.exercise}
                      style={{
                        padding: '1.25rem',
                        backgroundColor: 'var(--bg, #fff)',
                        border: '1px solid var(--border, #e5e4e7)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{pr.exercise}</div>
                        <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.85rem' }}>
                          {pr.totalEfforts} effort{pr.totalEfforts !== 1 ? 's' : ''} logged
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4f46e5' }}>
                          {pr.value} {pr.unit}
                        </div>
                        <div style={{ color: 'var(--text, #6b6375)', fontSize: '0.8rem' }}>
                          {pr.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
