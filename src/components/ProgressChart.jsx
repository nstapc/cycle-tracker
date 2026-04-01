import { useState, useEffect } from 'react';
import { fetchProgress } from '../api/nocodb';

export default function ProgressChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProgress().then(setData).catch(console.error);
  }, []);

  return (
    <section className="progress-chart">
      <h2>Progress Overview</h2>
      {data.length === 0 ? (
        <p>No progress data yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.Id}>
                <td>{row.date}</td>
                <td>{row.metric}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
