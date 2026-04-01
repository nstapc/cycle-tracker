import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts'

const CHART_METRICS = [
  { key: 'avg_power', label: 'Avg Power (W)', color: '#ef4444' },
  { key: 'distance', label: 'Distance (km)', color: '#22c55e' },
  { key: 'duration', label: 'Duration (min)', color: '#3b82f6' },
  { key: 'avg_hr', label: 'Avg HR (bpm)', color: '#f97316' },
]

const CHART_TYPES = ['Line', 'Area', 'Bar']

export default function ProgressChart({ sessions = [], efforts = [] }) {
  const [metric, setMetric] = useState('avg_power')
  const [chartType, setChartType] = useState('Line')
  const [sessionType, setSessionType] = useState('all')

  // Process session data for charts
  const chartData = useMemo(() => {
    if (!sessions || sessions.length === 0) return []

    // Sort by date ascending for proper chart rendering
    const sorted = [...sessions]
      .filter(s => s.date) // Only include sessions with dates
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    // Filter by session type if selected
    const filtered = sessionType === 'all'
      ? sorted
      : sorted.filter(s => s.type === sessionType)

    // Map to chart format
    return filtered.map((session, idx) => ({
      date: session.date,
      avg_power: session.avg_power || 0,
      distance: session.distance || 0,
      duration: session.duration || 0,
      avg_hr: session.avg_hr || 0,
      type: session.type,
      // Calculate rolling average for trend line
      index: idx + 1,
    }))
  }, [sessions, sessionType])

  // Calculate rolling averages for trend visualization
  const dataWithTrend = useMemo(() => {
    if (chartData.length < 3) return chartData
    
    const windowSize = Math.min(5, chartData.length)
    return chartData.map((point, idx) => {
      const start = Math.max(0, idx - windowSize + 1)
      const window = chartData.slice(start, idx + 1)
      const avg = window.reduce((sum, p) => sum + (p[metric] || 0), 0) / window.length
      return {
        ...point,
        trend: Math.round(avg * 10) / 10,
      }
    })
  }, [chartData, metric])

  // Get unique session types for filter dropdown
  const sessionTypes = useMemo(() => {
    const types = new Set(sessions.map(s => s.type).filter(Boolean))
    return ['all', ...Array.from(types)]
  }, [sessions])

  const currentMetric = CHART_METRICS.find(m => m.key === metric) || CHART_METRICS[0]

  // Calculate stats for the summary bar
  const stats = useMemo(() => {
    if (chartData.length === 0) return null
    const values = chartData.map(d => d[metric] || 0).filter(v => v > 0)
    if (values.length === 0) return null
    
    return {
      min: Math.round(Math.min(...values) * 10) / 10,
      max: Math.round(Math.max(...values) * 10) / 10,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length * 10) / 10,
      latest: values[values.length - 1],
    }
  }, [chartData, metric])

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div style={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--code-bg, #f4f3ec)',
          borderRadius: '0.75rem',
          color: 'var(--text, #6b6375)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No chart data available</p>
            <p>Log sessions with {currentMetric.label.toLowerCase()} data to see progress.</p>
          </div>
        </div>
      )
    }

    const commonProps = {
      data: dataWithTrend,
      margin: { top: 10, right: 20, left: 0, bottom: 0 },
    }

    const axisProps = {
      xAxis: (
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: 'var(--text, #6b6375)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--border, #e5e4e7)' }}
        />
      ),
      yAxis: (
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--text, #6b6375)' }}
          tickLine={false}
          axisLine={false}
          width={45}
        />
      ),
      grid: (
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border, #e5e4e7)" vertical={false} />
      ),
      tooltip: (
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e5e4e7)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}
          formatter={(value, name) => [
            `${value} ${currentMetric.label.split(' ').pop().replace(/[()]/g, '')}`,
            name === 'trend' ? 'Rolling Avg' : currentMetric.label
          ]}
          labelFormatter={(label) => `Date: ${label}`}
        />
      ),
    }

    switch (chartType) {
      case 'Area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              {axisProps.grid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={metric}
                stroke={currentMetric.color}
                fillOpacity={1}
                fill="url(#colorMetric)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="trend"
                stroke="#8b5cf6"
                fill="none"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case 'Bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              {axisProps.grid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              <Bar dataKey={metric} fill={currentMetric.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      default: // Line
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              {axisProps.grid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              <Line
                type="monotone"
                dataKey={metric}
                stroke={currentMetric.color}
                strokeWidth={2}
                dot={{ fill: currentMetric.color, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ marginBottom: '1rem' }}>Progress Over Time</h2>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text, #6b6375)', marginRight: '0.25rem' }}>Metric:</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
          >
            {CHART_METRICS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text, #6b6375)', marginRight: '0.25rem' }}>Chart:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
          >
            {CHART_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text, #6b6375)', marginRight: '0.25rem' }}>Type:</label>
          <select
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            style={{ padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid var(--border, #e5e4e7)' }}
          >
            {sessionTypes.map(t => (
              <option key={t} value={t}>{t === 'all' ? 'All Sessions' : t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          {[
            { label: 'Min', value: stats.min, color: '#6b7280' },
            { label: 'Avg', value: stats.avg, color: currentMetric.color },
            { label: 'Max', value: stats.max, color: '#22c55e' },
            { label: 'Latest', value: stats.latest, color: '#8b5cf6' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '0.75rem',
              backgroundColor: 'var(--code-bg, #f4f3ec)',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text, #6b6375)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--bg, #fff)',
        border: '1px solid var(--border, #e5e4e7)',
        borderRadius: '0.75rem'
      }}>
        {renderChart()}
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text, #6b6375)', fontStyle: 'italic' }}>
        Dashed line shows 5-session rolling average for trend analysis.
      </p>
    </div>
  )
}
