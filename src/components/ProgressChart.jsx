import { useState, useEffect } from 'react';
import { fetchProgress } from '../api/nocodb';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ProgressChart() {
  const [data, setData] = useState([]);
  const [metric, setMetric] = useState('weight');

  useEffect(() => {
    fetchProgress().then(setData).catch(console.error);
  }, []);

  const metrics = [...new Set(data.map((d) => d.metric))];
  const filtered = data
    .filter((d) => d.metric === metric)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Number(d.value),
    }))
    .reverse();

  return (
    <section className="progress-chart">
      <h2>Progress Overview</h2>
      {data.length === 0 ? (
        <p>No progress data yet.</p>
      ) : (
        <>
          <div className="metric-selector">
            {metrics.map((m) => (
              <button
                key={m}
                className={m === metric ? 'active' : ''}
                onClick={() => setMetric(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filtered} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#aa3bff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#aa3bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text)" fontSize={12} />
                <YAxis stroke="var(--text)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    color: 'var(--text-h)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#aa3bff"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
