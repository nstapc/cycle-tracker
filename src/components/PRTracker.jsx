import { useState, useEffect } from 'react';
import { fetchPRs, addPR } from '../api/nocodb';

export default function PRTracker() {
  const [prs, setPRs] = useState([]);
  const [form, setForm] = useState({ exercise: '', weight: '' });

  useEffect(() => {
    fetchPRs().then(setPRs).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPR = await addPR({
      ...form,
      weight: Number(form.weight),
      date: new Date().toISOString(),
    });
    setPRs((prev) => [...prev, newPR]);
    setForm({ exercise: '', weight: '' });
  };

  return (
    <section className="pr-tracker">
      <h2>Personal Records</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Exercise"
          value={form.exercise}
          onChange={(e) => setForm({ ...form, exercise: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Weight (lbs)"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
          required
        />
        <button type="submit">Add PR</button>
      </form>
      <ul>
        {prs.map((pr) => (
          <li key={pr.Id}>
            {pr.exercise}: {pr.weight}lbs
          </li>
        ))}
      </ul>
    </section>
  );
}
